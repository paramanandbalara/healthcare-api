const express = require('express');
const router = express.Router();
const AuthController = require('../controller/authController');

// Initiate login route (to trigger OTP generation and sending)
router.post('/login/initiate', AuthController.initiateLogin);

// Login route using phone number and OTP
router.post('/login', AuthController.loginWithOTP);

module.exports = router;
