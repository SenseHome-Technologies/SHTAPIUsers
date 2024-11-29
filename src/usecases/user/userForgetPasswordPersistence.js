const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../../framework/db/postgresql/userModel');
const transporter = require('../../framework/mail/config');

// Generate a random 6-digit code
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Ensures a 6-digit code
}

exports.forgotPassword = async (user) => {
    try {
        // Search for the user in the database
        const userRecord = await User.findOne({ where: { email: user.email } });

        // Validate if user exists
        if (!userRecord) {
            return { 
                status: 404, 
                message: 'User not found' 
            };
        }

        // Generate the verification code
        const verificationCode = generateVerificationCode();

        await userRecord.update(
            {
                verificationcode: verificationCode,
                codeexpiry: Date.now() + 300000
            }
        );

        // Email content
        const message = {
            from: process.env.GMAIL_USER,
            to: userRecord.email,
            subject: 'Verification Code',
            text: `Your verification code is: ${verificationCode}. This code is valid for 5 minutes.`,
        };

        console.log(message);

        // Send the email
        await transporter.sendMail(message);

        return { 
            status: 200, 
            message: 'Verification code sent successfully' 
        };
    } catch (error) {
        // Handle any errors during login process
        return {
            status: 500,
            message: error.message
        };
    }

}

exports.verifyCode = async (user) => {
    try { 
        const userRecord = await User.findOne({
            where: {
                email: user.email,
                verificationcode: user.verificationcode,
                codeexpiry: { [Op.gt]: Date.now() }, // Check that code is valid and not expired
            },
        });

        // Validate if user exists
        if (!userRecord) {
            return { 
                status: 404, 
                message: 'Invalid verification code' 
            };
        }

        // Clear the code after successful verification
        await userRecord.update({
            verificationcode: null,
            codeexpiry: null
        })

        // Generate a JWT token for the user
        const token = jwt.sign({id: userRecord.id}, process.env.JWT_SECRET, {expiresIn: 300});

        return { 
            status: 200, 
            message: 'Verification successful',
            token: token
        };

    } catch (error) {
        // Handle any errors during login process
        return {
            status: 500,
            message: error.message
        };
    }
}

exports.resetPassword = async (token, user) => {
    try {
        // Verify the token using JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user based on the username in the token
        const userRecord = await User.findByPk(decoded.id); 

        if (!userRecord) {
            return {
                status: 400,
                message: 'User not found'
            }
        }

        const passwordHash = await bcrypt.hash(user.password, 10); // 10 salt rounds

        // Update user details in the database
        await userRecord.update(
            {
                password: passwordHash, 
            }
        );

         // Respond with success message
        return {
            status: 200,
            message: "Password updated successfully"
        };
    } catch (error) {
        // Handle any errors during login process
        return {
            status: 500,
            message: error.message
        };
    }
}