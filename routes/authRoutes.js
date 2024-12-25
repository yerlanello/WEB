// authRoutes.js
const express = require('express');
const { body } = require('express-validator');
const { registerUser , loginUser  } = require('../controllers/authController'); // Import the functions

const router = express.Router();

// Registration endpoint
router.post(
    '/register',
    [
        body('name', 'Name is required').not().isEmpty(),
        body('email', 'Valid email is required').isEmail(),
        body('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    ],
    registerUser  // Use the imported function
);

// Login endpoint
router.post(
    '/login',
    [
        body('email', 'Valid email is required').isEmail(),
        body('password', 'Password is required').exists(),
    ],
    loginUser  // Use the imported function
);

module.exports = router;