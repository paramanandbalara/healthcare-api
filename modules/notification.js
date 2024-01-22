'use strict';

const request = require("request");

class notification {
    async sendSMS(otp, mobile_number) {
        try {
            const options = {
                method: 'GET',
                url: 'https://api.authkey.io/request',
                qs: {
                    authkey: `${process.env.AUTHKEY_SMS_EMAIL_KEY}`,
                    // sms: `Your OTP for homoeopatha is ${otp}`,
                    mobile: `${mobile_number}`,
                    otp: otp,
                    company: 'Homoeopatha',
                    country_code: '+91',
                    sender: 'AUTHKY',
                    sid:11581
                }
            }
            console.log(process.env.AUTHKEY_SMS_EMAIL_KEY)
            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                
                console.log(body);
                });

            // const response = await request(options);
            // console.log(response);
        } catch (error) {
            console.error(error);
        }
    }
    async sendEmail(email, content) {
        try {
            const options = {
                method: 'GET',
                url: 'https://api.authkey.io/request',
                qs: {
                    authkey: `${process.env.AUTHKEY_SMS_EMAIL_KEY}`,
                    email: email,
                    mid:1001
                    // sms: `Your OTP for homoeopatha is ${otp}`,
                    // mobile: `${mobile_number}`,
                    // country_code: '+91',
                    // sender: 'SENDERID'
                }
            }

            const response = await request(options);
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = new notification()