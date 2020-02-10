const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

// @desc    Get all Courses
// @route   GET /api/v1/courses
// @route   GET /api/v1/bootcamps/:bootcampId/courses
// @access  Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  // Init query variable
  let query;
  // Check to see weather there is an Bootcamp ID in the params then get that specific course
  if (req.params.bootcampId) {
    query = Course.find({
      bootcamp: req.params.bootcampId,
    });
    // query to return all courses
  } else {
    query = Course.find().populate({
      path: 'bootcamp',
      select: 'name description',
    });
  }
  // Call the query to the DB
  const courses = await query;
  // Query response data
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

// @desc    Get a single course
// @route   GET /api/v1/courses/:id
// @access  Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  });
  // Check to see if we have a course
  if (!course) {
    return next(new ErrorResponse(`No Course with the id of ${req.params.id}`), 404)
  }
  // Query response data
  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    Add course
// @route   POST /api/v1/bootcamps/:bootcampId/courses
// @access  Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  // Put bootcamp into the req.body
  req.body.bootcamp = req.params.bootcampId;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);
  // Check to see if we have a course
  if (!bootcamp) {
    return next(new ErrorResponse(`No Bootcamp with the id of ${req.params.bootcampId}`), 404)
  }
  const course = await Course.create(req.body)
  // Query response data
  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    Update course
// @route   POST /api/v1/courses/:id
// @access  Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  // Check to see if we have a course
  if (!course) {
    return next(new ErrorResponse(`No Course with the id of ${req.params.id}`), 404)
  }
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
  // Query response data
  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc    Delete course
// @route   Delete /api/v1/courses/:id
// @access  Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  // Check to see if we have a course
  if (!course) {
    return next(new ErrorResponse(`No Course with the id of ${req.params.id}`), 404)
  }
  await course.remove();
  // Query response data
  res.status(200).json({
    success: true,
    data: {},
  });
});