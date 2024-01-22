// Import necessary modules or dependencies
const UserModel = require('../models/UserModel');
const notifications = require('../modules/notification');
// Import any helper functions or libraries needed

class UsersController {
	static async registerUser(req, res) {
		try {
			const { name, email, phone_number } = req.body;

			// Generate OTP (You may use a library like Speakeasy to generate OTPs)
			const otp = generateOTP(); // Implement this function to generate OTP

			console.log(otp, 'otp');

			const userSaved = await UserModel.saveUser(name, email, phone_number); // Implement this in the UserModel
			if (!userSaved) {
				return res.status(500).json({ success: false, error: 'Failed to save user.' });
			}
			// Save the OTP to the database (using your model function)
			const otpSaved = await UserModel.saveOTP(phone_number, otp); // Implement this in the UserModel

            const notify = await notifications.sendSMS(otp,phone_number);

			// Send OTP to the user via SMS (You'll need a service/API for sending SMS)

			if (otpSaved) {
				return res.status(200).json({ success: true, message: 'OTP sent successfully.' });
			} else {
				return res.status(500).json({ success: false, error: 'Failed to generate OTP.' });
			}
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: error ?? 'Internal server error.' });
		}
	}

	static async verifyUser(req, res) {
		try {
			const { phone_number, otp: otpEntered } = req.body;

			// Fetch OTP from the database for the provided phoneNumber
			const savedOTP = await UserModel.getOTP(phone_number); // Implement this in the UserModel
			console.log(savedOTP, otpEntered)
			if (savedOTP === otpEntered) {
				// If OTP matches, mark the user as verified (you might update a 'verified' flag in the database)
				// await UserModel.markAsVerified(phoneNumber); // Implement this in the UserModel

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
	static async fetchUserList(req, res) {
		try {
			const users = await UserModel.getAllUsers();
			return res.status(200).json(users);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: 'Failed to fetch users.' });
		}
	}

	static async addUser(req, res) {
		try {
			// Extract user details from request body
			const { name, email, phone_number, role } = req.body;

			// Save user to the database
			const newUser = await UserModel.addUser({ name, email, phone_number, role });

			return res.status(201).json({ message: 'User added successfully!', user: newUser });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: 'Failed to add user.' });
		}
	}

	static async updateUser(req, res) {
		try {
			const userId = req.params.userId;
			const updatedInfo = req.body; // Updated user information

			// Update user in the database
			const updatedUser = await UserModel.updateUser(userId, updatedInfo);

			return res.status(200).json({ message: 'User updated successfully!', user: updatedUser });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: 'Failed to update user.' });
		}
	}

	static async deleteUser(req, res) {
		try {
			const userId = req.params.userId;

			// Delete user from the database
			const deletedUser = await UserModel.deleteUser(userId);

			return res.status(200).json({ message: 'User deleted successfully!', user: deletedUser });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ error: 'Failed to delete user.' });
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
