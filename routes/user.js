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

// Admin routes
// Fetch user list
router.get('/admin/users', usersController.fetchUserList);

// Add new user
router.post('/admin/users', usersController.addUser);

// Update user
router.put('/admin/users/:userId', usersController.updateUser);

// Delete user
router.delete('/admin/users/:userId', usersController.deleteUser);

module.exports = router;
