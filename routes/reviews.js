const express = require('express');
const router = express.Router({
  mergeParams: true
});

// Import controllers
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview
} = require('../controllers/Reviews');

// Protect middleware route
const { protect, authorize } = require('../middleware/auth');

const Review = require('../models/Review');
const advancedResults = require('../middleware/advancedResults');

router
  .route('/')
  .get(
    advancedResults(Review, {
      path: 'bootcamp',
      select: 'name description'
    }),
    getReviews
  )
  .post(protect, authorize('user', 'admin'), addReview);

router
  .route('/:id')
  .get(getReview)
  .put(protect, authorize('user', 'admin'), updateReview)
  .delete(protect, authorize('user', 'admin'), deleteReview);

module.exports = router;
