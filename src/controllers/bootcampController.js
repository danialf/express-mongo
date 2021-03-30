import path from 'path';
import Bootcamp from '../models/Bootcamp.js';
import ErrorResponse from '../response/errorResponse.js';
import asyncHandler from '../middleware/asyncMiddleware.js';
import geocoder from '../services/geocoder.js';


// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access PUBLIC
export const getBootcamps = asyncHandler(async (req, res, next) => {
     res.status(200).json(res.advancedResult)
})

// @desc Get the bootcamp
// @route GET /api/v1/bootcamps/:id
// @access PRIVATE
export const getBootcamp = asyncHandler(async (req, res, next) => {
     const bootcamp = await Bootcamp.findById(req.params.id)

     if (!bootcamp) {
          return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
     }

     res.status(200).json({
          success: true,
          data: bootcamp
     })
});

// @desc Post  bootcamp
// @route POST /api/v1/bootcamps
// @access PRIVATE
export const postBootcamp = asyncHandler(async (req, res, next) => {
     // Add user to req.body

     req.body.user = req.user.id;

     // Check for published bootcamp
     const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

     // if the user is not admin, they can only add one bootcamp
     if (publishedBootcamp && req.user.role !== 'admin') {
          return next(new ErrorResponse(`The user with id ${req.user.id} has already published a bootcamp`, 400))
     };

     const bootcamp = await Bootcamp.create(req.body)
     res.status(201).json({
          success: true,
          data: bootcamp
     })
});

// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access PRIVATE
export const updateBootcamp = asyncHandler(async (req, res, next) => {
     let bootcamp = await Bootcamp.findById(req.params.id);

     if (!bootcamp) {
          return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
     }

     // Make sure user is bootcamp owner
     if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
          return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this bootcamp`),401);
     }

     bootcamp = await bootcamp.update(req.body,{
          new: true,
          runValidators:true
     });

     res.status(200).json({
          success: true,
          data: bootcamp
     })
})

// @desc delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access PRIVATE
export const deleteBootcamp = asyncHandler(async (req, res, next) => {
     const bootcamp = await Bootcamp.findById(req.params.id);

     if (!bootcamp) {
          return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
     }

     // replace findByIdAndRemove with this to triger cascade delete
     bootcamp.remove();

     res.status(200).json({
          success: true,
          data: {}
     })
})

// @desc Get bootcamps within a radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance/
// @access PRIVATE
export const getBootcampsInRadius = asyncHandler(async (req, res, next) => {
     const { zipcode, distance } = req.params;

     // get lat/lng from geocoder
     const loc = await geocoder.geocode(zipcode);
     const lat = loc[0].latitude;
     const lng = loc[0].longitude;

     await _getBootcampsInRadius(lng, lat, distance, res)
})

// @desc Get bootcamps within a radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance/
// @access PRIVATE
export const getBootcampsInRadiusWithLatNLng = asyncHandler(async (req, res, next) => {
     const { lat, lng, distance } = req.params;

     await _getBootcampsInRadius(lng, lat, distance, res);
})

// Fetch bootcamps in radius
const _getBootcampsInRadius = async (lng, lat, distance, res) => {
     // Calculate radius using radians
     // Divide dist by radius of Earth
     // Earth radius = 3,963 mi / 6,378 km
     const radius = distance / 3963;

     const bootcamps = await Bootcamp.find({
          location: {
               $geoWithin: {
                    $centerSphere: [[lng, lat], radius]
               }
          }
     });

     res.status(200).json({
          success: true,
          count: bootcamps.length,
          data: bootcamps
     });
}

// @desc Upload photo for bootcamp
// @route DELETE /api/v1/bootcamps/:id/photo
// @access PRIVATE
export const bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
     const bootcamp = await Bootcamp.findById(req.params.id);

     if (!bootcamp) {
          return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
     }

     // Make sure user is bootcamp owner
     if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
          return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this bootcamp`),401);
     }

     if (!req.files) {
          return next(new ErrorResponse('please upload a photo', 400));
     }

     const file = req.files.file;

     // Make sure the image is a photo
     if (!file.mimetype.startWith('image')) {
          return next(new ErrorResponse('please upload a image file', 400));
     }

     // Check file size
     if (file.size > 1024000) {
          return next(new ErrorResponse('please upload a photo smaller than 1 MB', 400));
     }

     // Create custom filename
     file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

     // Save images to public image upload folder
     file.mv(`./public/uploads/${file.name}`, async err => {
          if (err) {
               console.error(err);
          }

          await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
     })

     res.status(200).json({
          success: true,
          data: file.name
     })
})