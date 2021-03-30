import ErrorResponse from '../response/errorResponse.js';
import asyncHandler from '../middleware/asyncMiddleware.js';
import { find, findById, create, findByIdAndUpdate } from '../models/Review.js';
import { findById as _findById } from '../models/Bootcamp.js';

export const getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

export const getReview = asyncHandler(async (req, res, next) => {
  const review = await findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  });

  if (!review) {
    return next(
      new ErrorResponse(`No review found with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: review
  });
});

export const addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await _findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No bootcamp with the id of ${req.params.bootcampId}`,
        404
      )
    );
  }

  const review = await create(req.body);

  res.status(201).json({
    success: true,
    data: review
  });
});

export const updateReview = asyncHandler(async (req, res, next) => {
  let review = await findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update review`, 401));
  }

  review = await findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  review.save();

  res.status(200).json({
    success: true,
    data: review
  });
});

export const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`No review with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`Not authorized to update review`, 401));
  }

  await review.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});