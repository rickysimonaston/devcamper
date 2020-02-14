const express = require('express');
const router = express.Router({
    mergeParams: true
});

// Import controllers
const {
    getCourses,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
} = require('../controllers/Courses');

// Protect middleware route
const {
    protect,
    authorize
} = require('../middleware/auth');

const Course = require('../models/Course');
const advancedResults = require('../middleware/advancedResults')

router.route('/').get(advancedResults(Course, {
    path: 'bootcamp',
    select: 'name description'
}), getCourses).post(protect, addCourse);
router.route('/:id').get(getCourse).put(protect, authorize('publisher', 'admin'), updateCourse).delete(protect, authorize('publisher', 'admin'), deleteCourse);

module.exports = router;