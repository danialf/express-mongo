import Bootcamp from '../models/Bootcamp.js';
import ErrorResponse from '../response/errorResponse.js';
import asyncHandler from '../middleware/asyncMiddleware.js';
import geocoder from '../services/geocoder.js';


// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access PUBLIC
export const getBootcamps = asyncHandler(async (req, res, next) => {
     let query;

     // copy req.query
     const requestQuery = { ...req.query };

     // Fileds to exclude
     const removeFields = ['select', 'sort', 'page', 'limit'];

     // Loop over removeFields and delete them fom requestQuery
     removeFields.forEach(param => delete requestQuery[param]);

     // Create query string
     let queryString = JSON.stringify(requestQuery);

     // Create operators
     queryString = queryString.replace(/\b(gt|gte|le|lte|in)\b/g, match => `$${match}`);

     // Finding resource
     query = Bootcamp.find(JSON.parse(queryString));

     // Select Fields
     if (req.query.select) {
          const fields = req.query.select.split[','].join(' ');
          query = query.select(fields);
     }

     // Sort
     if (req.query.sort) {
          const sortBy = req.query.sort.split[','].join(' ');
          query = query.sort(sortBy)
     }
     else {
          // default sort
          query = query.sort('-createdAt');
     }

     //const total = await Bootcamp.countDocuments();
     // execute query and only return count
     const total = await query.countDocuments();

     // Pagination
     const page = parseInt(req.query.page, 10) || 1;
     const limit = parseInt(req.query.limit, 10) || 25;
     const startIndex = (page - 1) * limit;
     const endIndex = page * limit;
     
     query = query.skip(startIndex).limit(limit);

     // Executing query
     const bootcamps = await query;

     // Pagination Result
     const pagination = {};

     if (endIndex < total) {
          pagination.next = {
               page: page + 1,
               limit
          }
     }
     if (startIndex > 0) {
          pagination.prev = {
               page: page - 1,
               limit
          }
     }

     res.status(200).json({
          success: true,
          data: bootcamps,
          count: bootcamps.length,
          pagination
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
