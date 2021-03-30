import Course from '../models/Course.js';
import Bootcamp from '../models/Bootcamp.js';
import ErrorResponse from '../response/errorResponse.js';
import asyncHandler from '../middleware/asyncMiddleware.js';

// @desc Get courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access PUBLIC
export const getCourses = asyncHandler(async (req, res, next) => {
     let query;

     if (req.params.bootcampId) {
          query = Course.find({ bootcamp: req.params.bootcampId });
     }
     else {
          query = Course.find();
     }

     // populate bootcamps
     query = query.populate({
          path: 'bootcamp',
          select: 'name description'
     })

     const courses = await query;

     res.status(200).json({
          success: true,
          count: courses.length,
          data: courses
     });
})

// @desc Get single course
// @route GET /api/v1/courses/:id
// @access PUBLIC
export const getCourse = asyncHandler(async (req, res, next) => {
     const course = await Course.findById(req.params.id).populate({
          path: 'bootcamp',
          select: 'name description'
     });

     if (!course) {
          return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 404)
     }

     res.status(200).json({
          success: true,
          data: courses
     });
})

// @desc Add course
// @route POST /api/v1/bootcamps/:bootcampId/courses
// @access PRIVATE
export const addCourse = asyncHandler(async (req, res, next) => {
     req.body.bootcamp = req.params.bootcampId;

     const bootcamp = await Bootcamp.findById(req.params.bootcampId);

     if (!bootcamp) {
          return next(new ErrorResponse(`No bootcamp with the id of ${req.params.id}`), 404)
     }

     const course = await Course.create(req.body);

     res.status(200).json({
          success: true,
          data: course
     });
})