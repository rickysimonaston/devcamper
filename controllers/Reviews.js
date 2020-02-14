const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');

// @desc    Get reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/bootcamps/:bootcampId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  // Check to see weather there is an Bootcamp ID in the params then get that specific course
  if (req.params.bootcampId) {
    const reviews = await Review.find({
      bootcamp: req.params.bootcampId
    });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
    //return all courses
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get Single Review
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReview = asyncHandler(async (req, res, next) => {
  // find review and populate the bootcamp information
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  });
  // Check to make sure review exists
  if (!review) {
    return next(
      new ErrorResponse(`No review found with the ID of ${req.params.id}`, 404)
    );
  }
  // User response
  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Add review Review
// @route   Post /api/v1/bootcamps/:bootcampId/reviews
// @access  Private
exports.addReview = asyncHandler(async (req, res, next) => {
  // Bootcamp id & user Id
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
  // Find bootcamp in the database
  const bootcamp = Bootcamp.findById(req.params.bootcampId);
  // Check to make sure review exists
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `No Bootcamp found with the ID of ${req.params.bootcampId}`,
        404
      )
    );
  }
  // Create Review
  const review = await Review.create(req.body);
  // User response
  res.status(201).json({
    success: true,
    data: review
  });
});

// @desc    Update Review
// @route   Post /api/v1/reviews/:id
// @access  Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  // Find Review in the database
  let review = await Review.findById(req.params.id);
  // Check to make sure review exists
  if (!review) {
    return next(
      new ErrorResponse(`No Review found with the ID of ${req.params.id}`, 404)
    );
  }
  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update review', 401));
  }
  // Create Review
  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  // User response
  res.status(200).json({
    success: true,
    data: review
  });
});

// @desc    Delete Review
// @route   DELETE /api/v1/reviews/:id
// @access  Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  // Find Review in the database
  const review = await Review.findById(req.params.id);
  // Check to make sure review exists
  if (!review) {
    return next(
      new ErrorResponse(`No Review found with the ID of ${req.params.id}`, 404)
    );
  }
  // Make sure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse('Not authorized to update review', 401));
  }
  // Create Review
  await review.remove();
  // User response
  res.status(200).json({
    success: true,
    data: {}
  });
});
