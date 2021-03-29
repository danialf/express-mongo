import Bootcamp from '../models/Bootcamp.js';

// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access PUBLIC
export const getBootcamps = async (req, res, next) => {
     try {
          const bootcamps = await Bootcamp.find();
          res.status(200).json({
               success: true,
               data: bootcamps,
               count: bootcamps.length
          })

     } catch (error) {
          res.status(400).json({ success: false })
     }

}

// @desc Get the bootcamp
// @route GET /api/v1/bootcamps/:id
// @access PRIVATE
export const getBootcamp = async (req, res, next) => {
     try {
          const bootcamp = await Bootcamp.findById(req.params.id)

          if (!bootcamp) {
               return res.status(404).json({
                    success: false
               })
          }

          res.status(200).json({
               success: true,
               data: bootcamp
          })
     } catch (error) {
          res.status(400).joson({ success: false });
     }

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

// @desc Update bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access PRIVATE
export const updateBootcamp = async (req, res, next) => {
     try {
          const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
               new: true,
               runValidators: true
          });

          if (!bootcamp) {
               return res.status(400).json({
                    success: false
               })
          }

          res.status(200).json({
               success: true,
               data: bootcamp
          })
     }
     catch (error) {
          res.status(400).json({ success: false })
     }
}

// @desc delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access PRIVATE
export const deleteBootcamp = async (req, res, next) => {
     try {
          const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

          if (!bootcamp) {
               return res.status(400).json({
                    success: false
               })
          }

          res.status(200).json({
               success: true,
               data: {}
          })
     }
     catch (error) {
          res.status(400).json({ success: false })
     }
}