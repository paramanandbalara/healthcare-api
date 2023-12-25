// Import necessary modules or dependencies
const UserModel = require('../models/UserModel');
// Import any helper functions or libraries needed

class UsersController {
	static async registerUser(req, res) {
		try {
			const { phoneNumber } = req.body;

			// Generate OTP (You may use a library like Speakeasy to generate OTPs)
			const otp = generateOTP(); // Implement this function to generate OTP

			console.log(otp);

			// Save the OTP to the database (using your model function)
			const otpSaved = await UserModel.saveOTP(phoneNumber, otp); // Implement this in the UserModel

			// Send OTP to the user via SMS (You'll need a service/API for sending SMS)

			if (otpSaved) {
				return res.status(200).json({ message: 'OTP sent successfully.' });
			} else {
				return res.status(500).json({ error: 'Failed to generate OTP.' });
			}
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: 'Internal server error.' });
		}
	}

	static async verifyUser(req, res) {
		try {
			const { phoneNumber, otpEntered } = req.body;

			// Fetch OTP from the database for the provided phoneNumber
			const savedOTP = await UserModel.getOTP(phoneNumber); // Implement this in the UserModel

			if (savedOTP === otpEntered) {
				// If OTP matches, mark the user as verified (you might update a 'verified' flag in the database)
				await UserModel.markAsVerified(phoneNumber); // Implement this in the UserModel

				return res.status(200).json({ message: 'User verified successfully.' });
			} else {
				return res.status(400).json({ error: 'Invalid OTP.' });
			}
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: 'Internal server error.' });
		}
	}

	static async getUserProfile(req, res) {
		try {
			const userId = req.params.userId;

			// Logic to fetch user profile information
			const userProfile = await UserModel.getUserProfile(userId); // Implement this in UserModel

			if (userProfile) {
				return res.status(200).json({ userProfile });
			} else {
				return res.status(404).json({ error: 'User profile not found.' });
			}
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: 'Internal server error.' });
		}
	}

	static async updateUserProfile(req, res) {
		try {
			const userId = req.params.userId;
			const updatedInfo = req.body.updatedInfo; // Updated user information

			// Logic to update user profile information
			const profileUpdated = await UserModel.updateUserProfile(userId, updatedInfo); // Implement this in UserModel

			if (profileUpdated) {
				return res.status(200).json({ message: 'User profile updated successfully.' });
			} else {
				return res.status(500).json({ error: 'Failed to update user profile.' });
			}
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: 'Internal server error.' });
		}
	}
}

function generateOTP() {
	const OTP_LENGTH = 6;
	const digits = '0123456789';
	let OTP = '';

	for (let i = 0; i < OTP_LENGTH; i++) {
		OTP += digits[Math.floor(Math.random() * 10)];
	}

	return OTP;
}

module.exports = UsersController;
