import Bootcamp from '../models/Bootcamp.js';
import ErrorResponse from '../response/errorResponse.js';
import asyncHandler from '../middleware/asyncMiddleware.js';
import geocoder from '../services/geocoder.js';


// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access PUBLIC
export const getBootcamps = asyncHandler(async (req, res, next) => {
     let query;
     let queryString = JSON.stringify(req.query);

     queryString = queryString.replace(/\b(gt|gte|le|lte|in)\b/g, match => `$${match}`);

     query = Bootcamp.find(JSON.parse(queryString));

     const bootcamps = await queryString;
     res.status(200).json({
          success: true,
          data: bootcamps,
          count: bootcamps.length
     })
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
     const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true
     });

     if (!bootcamp) {
          return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
     }

     res.status(200).json({
          success: true,
          data: bootcamp
     })
})

// @desc delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access PRIVATE
export const deleteBootcamp = asyncHandler(async (req, res, next) => {
     const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

     if (!bootcamp) {
          return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
     }

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
