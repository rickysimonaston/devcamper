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

router.route('/').get(getCourses).post(addCourse);
router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

module.exports = router;