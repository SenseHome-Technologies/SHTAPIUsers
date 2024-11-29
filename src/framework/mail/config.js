const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
service: 'gmail', // Use Gmail's SMTP service
    auth: {
        user: process.env.GMAIL_USER, // Your Gmail address
        pass: process.env.GMAIL_APP_PASSWORD, // App password from Gmail settings
    },
});

module.exports = transporter;