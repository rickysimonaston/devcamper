const express = require('express');
const router = express.Router();

// Import controllers
const {
    register,
    login,
    getMe
} = require('../controllers/Auth');

const {
    protect
} = require('../middleware/auth')

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);


module.exports = router;