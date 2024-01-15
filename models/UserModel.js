// Import necessary modules
// Import your database connection (readDb, writeDb)

class UserModel {
	static async saveUser(name, email, phone_number) {
		try {
			// Implement your database query to save User for the phoneNumber
			const [userExists] = await readDb.query('SELECT * FROM users WHERE phone_number = ?;', [phone_number]);

			if (userExists.length) {
				throw new Error('User already exists.')
			}
			const query = 'INSERT INTO users (name, email, phone_number) VALUES (?, ?, ?);'
			const values = [name, email, phone_number]
			const [result] = await writeDb.query(query, values);

			if (result.affectedRows > 0) {
				return true; // User saved successfully
			} else {
				return false; // Failed to save User
			}
		} catch (error) {
			console.error(error);
			throw new Error('Error saving User.');
		}
	}
	static async saveOTP(phone_number, otp) {
		try {
			// Implement your database query to save OTP for the phoneNumber
			const userExists = await readDb.query('SELECT * FROM users WHERE phone_number = ?;', [phone_number]);

			const query = 'UPDATE users SET otp = ? WHERE phone_number = ?;';
			const values = [otp, phone_number];
			const [result] = await writeDb.query(query, values);

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

	static async getOTP(phone_number) {
		try {
			// Implement database query to fetch OTP for the phoneNumber
			const query = 'SELECT otp FROM users WHERE phone_number = ?';
			const [result] = await readDb.query(query, [phone_number]);

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
	static async getUserByPhoneNumber(phone_number) {
		try {
			// Implement database query to fetch User for the phoneNumber
			const query = 'SELECT * FROM users WHERE phone_number = ?';
			const [result] = await readDb.query(query, [phone_number]);

			if (result && result.length > 0) {
				return result[0];
			} else {
				return null; // No User found for the phoneNumber
			}
		} catch (error) {
			console.error(error);
			throw new Error('Error fetching OTP.');
		}
	}

	static async markAsVerified(phone_number) {
		try {
			// Implement database query to mark the user as verified
			const query = 'UPDATE users SET verified = true WHERE phone_number = ?';
			const [result] = await writeDb.query(query, [phone_number]);

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

			const [result] = await writeDb.query(updateQuery, updateValues);

			return result.affectedRows > 0;
		} catch (error) {
			console.error(error);
			throw new Error('Error updating user profile.');
		}
	}
	static async getAllUsers() {
		try {
			const [users] = await readDb.query('SELECT * FROM users');
			return users;
		} catch (error) {
			console.error(error);
			throw new Error('Failed to fetch users.');
		}
	}

	static async addUser(userDetails) {
		try {
			const { name, email, phone_number, role } = userDetails;
			const query = 'INSERT INTO users (name, email, phone_number, role) VALUES (?, ?, ?, ?)';
			const values = [name, email, phone_number, role];

			const [result] = await writeDb.query(query, values);

			if (result.affectedRows > 0) {
				return userDetails;
			} else {
				throw new Error('Failed to add user.');
			}
		} catch (error) {
			console.error(error);
			throw new Error('Failed to add user.');
		}
	}

	static async updateUser(userId, updatedInfo) {
		try {
			const { name, email, phone_number, role } = updatedInfo;
			const query = 'UPDATE users SET name = ?, email = ?, phone_number = ?, role = ? WHERE id = ?';
			const values = [name, email, phone_number, role, userId];

			const [result] = await writeDb.query(query, values);

			if (result.affectedRows > 0) {
				return { id: userId, ...updatedInfo };
			} else {
				throw new Error('Failed to update user.');
			}
		} catch (error) {
			console.error(error);
			throw new Error('Failed to update user.');
		}
	}

	static async deleteUser(userId) {
		try {
			const query = 'DELETE FROM users WHERE id = ?';
			const [result] = await writeDb.query(query, [userId]);

			if (result.affectedRows > 0) {
				return { id: userId };
			} else {
				throw new Error('Failed to delete user.');
			}
		} catch (error) {
			console.error(error);
			throw new Error('Failed to delete user.');
		}
	}

	static async validateOTP(phone_number, otpEntered) {
		try {
			// Retrieve the stored OTP for the given phone number from the database or temporary storage
			const [storedOTP] = await readDb.query('SELECT otp FROM users WHERE phone_number = ?', phone_number); // Implement this function

			if (!storedOTP.length) {
				return false; // OTP not found for the phone number
			}

			// Compare the entered OTP with the stored OTP and check if it's expired
			if (storedOTP[0].otp !== otpEntered) {
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
