import ErrorResponse from '../response/errorResponse.js';
import asyncHandler from '../middleware/asyncMiddleware.js';
import { findById, create, findByIdAndUpdate, findByIdAndDelete } from '../models/User.js';

export const getUsers = asyncHandler(async (req, res, next) => {
     res.status(200).json(res.advancedResults);
});

export const getUser = asyncHandler(async (req, res, next) => {
     const user = await findById(req.params.id);

     res.status(200).json({
          success: true,
          data: user
     });
});

export const createUser = asyncHandler(async (req, res, next) => {
     const user = await create(req.body);

     res.status(201).json({
          success: true,
          data: user
     });
});

export const updateUser = asyncHandler(async (req, res, next) => {
     const user = await findByIdAndUpdate(req.params.id, req.body, {
          new: true,
          runValidators: true
     });

     res.status(200).json({
          success: true,
          data: user
     });
});

export const deleteUser = asyncHandler(async (req, res, next) => {
     await findByIdAndDelete(req.params.id);

     res.status(200).json({
          success: true,
          data: {}
     });
});