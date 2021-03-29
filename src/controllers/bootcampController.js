
// @desc Get all bootcamps
// @route GET /api/v1/bootcamps
// @access PUBLIC
exports.getBootcamps = (req, res, next) => {
     res.status(200).json({
          success: true,
          message: 'Get all bootcamps'
     })
}

// @desc Get the bootcamp
// @route GET /api/v1/bootcamps/:id
// @access PRIVATE
exports.getBootcamp = (req, res, next) => {
     res.status(200).json({
          success: true,
          message: `Get bootcamp ${req.params.id}`
     })
}

// @desc Post  bootcamp
// @route POST /api/v1/bootcamps
// @access PRIVATE
exports.postBootcamp = (req, res, next) => {
     res.status(200).json({
          success: true,
          message: 'Post bootcamp'
     })
}

// @desc Put bootcamp
// @route PUT /api/v1/bootcamps/:id
// @access PRIVATE
exports.putBootcamp = (req, res, next) => {
     res.status(200).json({
          success: true,
          message: `Put bootcamp ${req.params.id}`
     })
}

// @desc delete bootcamp
// @route DELETE /api/v1/bootcamps/:id
// @access PRIVATE
exports.deleteBootcamp = (req, res, next) => {
     res.status(200).json({
          success: true,
          message: `Get bootcamp ${req.params.id}`
     })
}