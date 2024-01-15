// Import necessary modules or dependencies
const UserModel = require('../models/UserModel');

class AuthController {
    static async initiateLogin(req, res) {
        try {
            const phone_number = req.body;

            if(!phone_number){
                res.status(500).json({error:'Enter phone number.'})
            }

            // Generate OTP
            const otp = generateOTP(); // Implement OTP generation logic

            console.log(otp)
            
            // Save OTP to the database or temporary storage associated with the phone number
            const otp_saved = await UserModel.saveOTP(phone_number, otp); // Implement function to save OTP

            console.log(otp_saved)
            // Send OTP via SMS
            // await sendOTP(phone_number otp); // Implement function to send OTP

            return res.status(200).json({ success: true, message: 'OTP sent successfully.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    }

    static async loginWithOTP(req, res) {
        try {
            const { phone_number, otp } = req.body;

            // Verify OTP (using UserModel's validateOTP method)
            const isValidOTP = await UserModel.validateOTP(phone_number, otp);

            if (!isValidOTP) {
                return res.status(401).json({ error: 'Invalid OTP.' });
            }

            // If OTP is valid, perform login operations (grant access to the user)
            const user = await UserModel.getUserByPhoneNumber(phoneNumber); // Fetch user details

            // Example: Generate JWT token for user session
            // const token = generateToken(user.id); // Implement token generation

            return res.status(200).json({ user });
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

module.exports = AuthController;
