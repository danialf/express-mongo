import Bootcamp from '../models/Bootcamp.js';

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access PUBLIC
export function getBootcamps(req, res, next) {
     res.status(200).json({
          success: true,
          message: 'Get all bootcamps'
     })
}

// @desc Get the bootcamp
// @route GET /api/v1/bootcamps/:id
// @access PRIVATE
export function getBootcamp(req, res, next) {
     res.status(200).json({
          success: true,
          message: `Get bootcamp ${req.params.id}`
     })
}

// @desc Post  bootcamp
// @route POST /api/v1/bootcamps
// @access PRIVATE
export const postBootcamp = async (req, res, next) => {
     try {
          const bootcamp = await Bootcamp.create(req.body)
          res.status(201).json({
               success: true,
               data: bootcamp
          })
     } catch (error) {
          res.status(400).json({
               success: false,
               message: error.message
          })
     }

}

// @desc Put bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access PRIVATE
export function putBootcamp(req, res, next) {
     res.status(200).json({
          success: true,
          message: `Put bootcamp ${req.params.id}`
     })
}

// @desc delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access PRIVATE
export function deleteBootcamp(req, res, next) {
     res.status(200).json({
          success: true,
          message: `Get bootcamp ${req.params.id}`
     })
}