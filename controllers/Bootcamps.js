const path = require('path');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');
const Bootcamp = require('../models/Bootcamp');
// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advancedResults);
});

// @desc    Get single bootcamp
// @route   GET /api/v1/bootcamps:id
// @access  Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    // If no bootcamp is in the database
    if (!bootcamp) {
        const error = new ErrorResponse(
            `Bootcamp not found id of ${req.params.id}`,
            404
        );
        return next(error);
    }
    // If bootcamp is found and data is sent back to the user
    res.status(200).json({
        success: true,
        data: bootcamp,
    });
});
// @desc    Create new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
        success: true,
        data: bootcamp,
    });
});

// @desc    Update bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!bootcamp) {
        const error = new ErrorResponse(
            `Bootcamp not found id of ${req.params.id}`,
            404
        );
        return next(error);
    }
    res.status(200).json({
        success: true,
        data: bootcamp,
    });
});
// @desc    Delete bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        const error = new ErrorResponse(
            `Bootcamp not found id of ${req.params.id}`,
            404
        );
        return next(error);
    }
    // Delete bootcamp
    bootcamp.remove();
    // Response to user
    res.status(200).json({
        success: true,
        data: {},
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
                ],
            },
        },
    });
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps,
    });
});
// @desc    Upload photo for bootcamp
// @route   DELETE /api/v1/bootcamps/:id/photo
// @access  Private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    // Checks there is a bootcamp
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found id of ${req.params.id}`, 404));
    }
    // Check to make sure there is a file
    if (!req.files) {
        return next(new ErrorResponse(`Please upload  file`, 400));
    }
    // File object variable
    const file = req.files.file
    // Make sure the file is a photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Please upload an image file`, 400));
    }
    // Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400))
    }
    // Create custom file name
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`
    // Move file
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
        // Check error
        if (err) {
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`, 500))
        }
        await Bootcamp.findByIdAndUpdate(req.params.id, {
            photo: file.name
        });
        //Response to user
        res.status(200).json({
            success: true,
            data: file.name,
        });
    })

});