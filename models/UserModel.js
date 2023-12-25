// Import necessary modules
// Import your database connection (readDb, writeDb)

class UserModel {
	static async saveOTP(phoneNumber, otp) {
		try {
			// Implement your database query to save OTP for the phoneNumber
			const query = 'INSERT INTO users (phone_number, otp) VALUES (?, ?)';
			const values = [phoneNumber, otp];
			const result = await writeDb.query(query, values);

			if (result.affectedRows > 0) {
				return true; // OTP saved successfully
			} else {
				return false; // Failed to save OTP
			}
		} catch (error) {
			console.error(error);
			throw new Error('Error saving OTP.');
		}
	}

	static async getOTP(phoneNumber) {
		try {
			// Implement database query to fetch OTP for the phoneNumber
			const query = 'SELECT otp FROM users WHERE phone_number = ?';
			const result = await readDb.query(query, [phoneNumber]);

			if (result && result.length > 0) {
				return result[0].otp;
			} else {
				return null; // No OTP found for the phoneNumber
			}
		} catch (error) {
			console.error(error);
			throw new Error('Error fetching OTP.');
		}
	}

	static async markAsVerified(phoneNumber) {
		try {
			// Implement database query to mark the user as verified
			const query = 'UPDATE users SET verified = true WHERE phone_number = ?';
			const result = await writeDb.query(query, [phoneNumber]);

			if (result.affectedRows > 0) {
				return true; // User marked as verified successfully
			} else {
				return false; // Failed to mark user as verified
			}
		} catch (error) {
			console.error(error);
			throw new Error('Error marking user as verified.');
		}
	}

	static async getUserProfile(userId) {
		try {
			const userProfileQuery = 'SELECT * FROM users WHERE id = ?';
			const userProfile = await readDb.query(userProfileQuery, [userId]);

			if (userProfile.length === 0) {
				return null;
			}

			return userProfile[0];
		} catch (error) {
			console.error(error);
			throw new Error('Error fetching user profile.');
		}
	}

	static async updateUserProfile(userId, updatedInfo) {
		try {
			const { name, email, address /* Add more fields as needed */ } = updatedInfo;

			const updateQuery = 'UPDATE users SET name = ?, email = ?, address = ? WHERE id = ?';
			const updateValues = [name, email, address, userId];

			const result = await writeDb.query(updateQuery, updateValues);

			return result.affectedRows > 0;
		} catch (error) {
			console.error(error);
			throw new Error('Error updating user profile.');
		}
	}

	static async validateOTP(phoneNumber, otpEntered) {
		try {
			// Retrieve the stored OTP for the given phone number from the database or temporary storage
			const storedOTP = await readDb.getOTPByPhoneNumber(phoneNumber); // Implement this function

			if (!storedOTP) {
				return false; // OTP not found for the phone number
			}

			// Compare the entered OTP with the stored OTP and check if it's expired
			if (storedOTP.otp !== otpEntered || storedOTP.expiry < Date.now()) {
				return false; // Invalid OTP or expired
			}

			// If the OTP is valid and not expired, return true
			return true;
		} catch (error) {
			console.error(error);
			throw new Error('Error validating OTP.');
		}
	}
}

module.exports = UserModel;
