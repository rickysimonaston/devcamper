const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
    const count = await Bootcamp.countDocuments();
    const bootcamps = await Bootcamp.find();
    res.status(200).json({
        success: true,
        count: count,
        data: bootcamps,
    })
});

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id)
    // If no bootcamp is in the database
    if (!bootcamp) {
        const error = new ErrorResponse(`Bootcamp not found id of ${req.params.id}`, 404);
        return next(error);
    }
    // If bootcamp is found and data is sent back to the user
    res.status(200).json({
        success: true,
        data: bootcamp
    })
});
// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        success: true,
        data: bootcamp
    });
});

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!bootcamp) {
        const error = new ErrorResponse(`Bootcamp not found id of ${req.params.id}`, 404);
        return next(error);
    }
    res.status(200).json({
        success: true,
        data: bootcamp
    });
});
// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
        const error = new ErrorResponse(`Bootcamp not found id of ${req.params.id}`, 404);
        return next(error);
    }
    res.status(200).json({
        success: true,
        data: {}
    });
});
// @desc    Get bootcamps within a radius
// @route   GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access  Public
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const {
        zipcode,
        distance
    } = req.params;
    //Get lat/lng from geocoder
    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;
    // Calc radius using radians
    // Divide distance by radius of the earth
    // Earth radius = 3963 miles / 6378 km
    const radius = distance / 6378;
    const bootcamps = await Bootcamp.find({
        location: {
            $geoWithin: {
                $centerSphere: [
                    [lng, lat], radius
                ]
            }
        }
    });
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
});