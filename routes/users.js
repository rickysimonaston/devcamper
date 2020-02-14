const express = require('express');
const router = express.Router({
  mergeParams: true
});

// Import controllers
const {
  getUsers,
  getUser,
  updateUser,
  createUser,
  deleteUser
} = require('../controllers/User');

// Protect middleware route
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');

const User = require('../models/User');

router.use(protect);
router.use(authorize('admin'));

router
  .route('/')
  .get(advancedResults(User), getUsers)
  .post(createUser);
router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
