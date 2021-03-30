import { createHash } from 'crypto';
import ErrorResponse from '../response/errorResponse.js';
import asyncHandler from '../middleware/asyncMiddleware.js';
import sendEmail from '../services/sendEmail.js';
import { create, findOne, findByIdAndUpdate, findById } from '../models/User.js';

export const register = asyncHandler(async (req, res, next) => {
     const { name, email, password, role } = req.body;

     // Create user
     const user = await create({
          name,
          email,
          password,
          role,
     });

     // grab token and send to email
     const confirmEmailToken = user.generateEmailConfirmToken();

     // Create reset url
     const confirmEmailURL = `${req.protocol}://${req.get(
          'host',
     )}/api/v1/auth/confirmemail?token=${confirmEmailToken}`;

     const message = `You are receiving this email because you need to confirm your email address. Please make a GET request to: \n\n ${confirmEmailURL}`;

     user.save({ validateBeforeSave: false });

     const sendResult = await sendEmail({
          email: user.email,
          subject: 'Email confirmation token',
          message,
     });

     sendTokenResponse(user, 200, res);
});

export const login = asyncHandler(async (req, res, next) => {
     const { email, password } = req.body;

     // Validate emil and password
     if (!email || !password) {
          return next(new ErrorResponse('Please provide email and password', 400));
     }

     // Check for user
     const user = await findOne({ email }).select('+password');

     if (!user) {
          return next(new ErrorResponse('Invalid credentials', 401));
     }

     // Check if password matches
     const isMatch = await user.matchPassword(password);

     if (!isMatch) {
          return next(new ErrorResponse('Invalid credentials', 401));
     }

     sendTokenResponse(user, 200, res);
});

export const logout = asyncHandler(async (req, res, next) => {
     res.cookie('token', 'none', {
          expires: new Date(Date.now() + 10 * 1000),
          httpOnly: true,
     });

     res.status(200).json({
          success: true,
          data: {},
     });
});

export const getMe = asyncHandler(async (req, res, next) => {
     // user is already available in req due to the protect middleware
     const user = req.user;

     res.status(200).json({
          success: true,
          data: user,
     });
});

export const updateDetails = asyncHandler(async (req, res, next) => {
     const fieldsToUpdate = {
          name: req.body.name,
          email: req.body.email,
     };

     const user = await findByIdAndUpdate(req.user.id, fieldsToUpdate, {
          new: true,
          runValidators: true,
     });

     res.status(200).json({
          success: true,
          data: user,
     });
});

export const updatePassword = asyncHandler(async (req, res, next) => {
     const user = await findById(req.user.id).select('+password');

     // Check current password
     if (!(await user.matchPassword(req.body.currentPassword))) {
          return next(new ErrorResponse('Password is incorrect', 401));
     }

     user.password = req.body.newPassword;
     await user.save();

     sendTokenResponse(user, 200, res);
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
     const user = await findOne({ email: req.body.email });

     if (!user) {
          return next(new ErrorResponse('There is no user with that email', 404));
     }

     // Get reset token
     const resetToken = user.getResetPasswordToken();

     await user.save({ validateBeforeSave: false });

     // Create reset url
     const resetUrl = `${req.protocol}://${req.get(
          'host',
     )}/api/v1/auth/resetpassword/${resetToken}`;

     const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

     try {
          await sendEmail({
               email: user.email,
               subject: 'Password reset token',
               message,
          });

          res.status(200).json({ success: true, data: 'Email sent' });
     } catch (err) {
          console.log(err);
          user.resetPasswordToken = undefined;
          user.resetPasswordExpire = undefined;

          await user.save({ validateBeforeSave: false });

          return next(new ErrorResponse('Email could not be sent', 500));
     }
});

export const resetPassword = asyncHandler(async (req, res, next) => {
     // Get hashed token
     const resetPasswordToken = createHash('sha256')
          .update(req.params.resettoken)
          .digest('hex');

     const user = await findOne({
          resetPasswordToken,
          resetPasswordExpire: { $gt: Date.now() },
     });

     if (!user) {
          return next(new ErrorResponse('Invalid token', 400));
     }

     // Set new password
     user.password = req.body.password;
     user.resetPasswordToken = undefined;
     user.resetPasswordExpire = undefined;
     await user.save();

     sendTokenResponse(user, 200, res);
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
     // grab token from email
     const { token } = req.query;

     if (!token) {
          return next(new ErrorResponse('Invalid Token', 400));
     }

     const splitToken = token.split('.')[0];
     const confirmEmailToken = createHash('sha256')
          .update(splitToken)
          .digest('hex');

     // get user by token
     const user = await findOne({
          confirmEmailToken,
          isEmailConfirmed: false,
     });

     if (!user) {
          return next(new ErrorResponse('Invalid Token', 400));
     }

     // update confirmed to true
     user.confirmEmailToken = undefined;
     user.isEmailConfirmed = true;

     // save
     user.save({ validateBeforeSave: false });

     // return token
     sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
     // Create token
     const token = user.getSignedJwtToken();

     const options = {
          expires: new Date(
               // 30 days
               Date.now() + process.env.JWT_COOKIE_EXPIRE * 86400000,
          ),
          httpOnly: true,
     };

     if (process.env.NODE_ENV === 'production') {
          options.secure = true;
     }

     res.status(statusCode)
          .cookie('token', token, options)
          .json({
               success: true,
               token,
          });
};