const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc    Register User
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    // Get info from body
    const {
        name,
        email,
        password,
        role
    } = req.body;

    // Create user
    const user = await User.create({
        name,
        email,
        password,
        role
    });
    // Send token cookie back to user
    sendTokenResponse(user, 200, res)
});

// @desc    Login User
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    // Get info from body
    const {
        email,
        password
    } = req.body;

    // Validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide and email and password', 400))
    }
    // Check for user
    const user = await User.findOne({
        email
    }).select('+password');
    // Check if user exists
    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401))
    }
    // Validate password: match plain password with incrypt password
    const isMatch = await user.matchPassword(password);
    // Check to ensure passwords match - this password should be the same as no user error
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401))
    }
    // Send token cookie back to user
    sendTokenResponse(user, 200, res)
});

// Get token from model , create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create Token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    };
    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token
        });
}

// @desc    Get current logged in user
// @route   POST /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    })
});