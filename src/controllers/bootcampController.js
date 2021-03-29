import Bootcamp from '../models/Bootcamp.js';
import ErrorResponse from '../response/errorResponse.js';
import asyncHandler from '../middleware/asyncMiddleware.js';

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access PUBLIC
export const getBootcamps = asyncHandler(async (req, res, next) => {
     const bootcamps = await Bootcamp.find();
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