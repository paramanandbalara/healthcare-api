const express = require('express');
const router = express.Router();
const usersController = require('../controller/usersController');

// POST route for user registration
router.post('/register', usersController.registerUser);

// POST route for user verification
router.post('/verify', usersController.verifyUser);

// User profile routes
router.get('/profile/:userId', usersController.getUserProfile);
router.put('/profile/:userId', usersController.updateUserProfile);

module.exports = router;
