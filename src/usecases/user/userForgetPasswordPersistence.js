const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../../framework/db/postgresql/userModel');
const transporter = require('../../framework/mail/config');

// Generate a random 6-digit code
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Ensures a 6-digit code
}

/**
 * Persists a user's password reset request in the database and sends an email to the user with a verification code.
 * 
 * @async
 * @function forgotPassword
 * @param {Object} user - The user object containing the user's email.
 * @param {string} user.email - The email of the user.
 * @returns {Promise<Object>} The result object containing the status code and message.
 * @throws {Error} Throws an error if there is an issue with user creation.
 *
 * @description This function searches for the user in the database, generates a verification code, and sends an email to the user with the verification code.
 * If the user is not found, it returns a 404 status error. If the creation is successful, it returns a 200 status with a success message. If a duplicate key
 * error occurs, it returns a 400 status error, indicating the user already exists. Other errors result in a 500 status error.
 */
exports.forgotPassword = async (user) => {
    try {
        // Search for the user in the database
        const userRecord = await User.findOne({ where: { email: user.email } });

        // Validate if user exists
        if (!userRecord) {
            // User not found
            return { status: 404, message: 'User not found' };
        }

        // Generate the verification code
        const verificationCode = generateVerificationCode();
        // Update the user record with the verification code
        await userRecord.update({
            verificationcode: verificationCode,
            codeexpiry: Date.now() + 300000 // 5 minutes
        });

        // Email content
        const message = {
            from: process.env.GMAIL_USER,
            to: userRecord.email,
            subject: 'Verification Code',
            text: `Your verification code is: ${verificationCode}. This code is valid for 5 minutes.`,
        };

        // Send the email
        await transporter.sendMail(message);

        return { 
            status: 200, 
            message: 'Verification code sent successfully' 
        };
    } catch (error) {
        // Handle any errors during login process
        return { status: 500,message: error.message };
    }
}

        /**
         * Verifies a user given a valid verification code.
         * 
         * @async
         * @function verifyCode
         * @param {Object} user - The user object containing email and verification code.
         * @param {string} user.email - The email of the user.
         * @param {string} user.verificationcode - The verification code provided by the user.
         * @returns {Promise<Object>} An object containing the status code, message, and a JWT token.
         * 
         * @throws {Error} Throws an error if there is an issue with database access or JWT token generation.
         * 
         * @description This function finds the user record with the matching email and verification code that has not expired.
         * If the user record exists, it clears the verification code and expiry, generates a JWT token for the user with a short expiration time,
         * and returns a 200 status with a success message and the token. If the user record does not exist, it returns a 404 status with an error message.
         * Any errors encountered during the process result in a 500 status with the error message.
         */
exports.verifyCode = async (user) => {
    try {
        // Find the user record with the matching email, verification code, and non-expired code
        const userRecord = await User.findOne({
            where: {
                email: user.email,
                verificationcode: user.verificationcode,
                codeexpiry: { [Op.gt]: Date.now() }, // Ensure the code is valid and not expired
            },
        });

        // Check if the user record exists
        if (!userRecord) {
            // If no user found, return a 404 status with an error message
            return { status: 404, message: 'Invalid verification code' };
        }

        // Clear the verification code and expiry after successful verification
        await userRecord.update({
            verificationcode: null,
            codeexpiry: null,
        });

        // Generate a JWT token for the user with a short expiration time
        const token = jwt.sign({ id: userRecord.id }, process.env.JWT_SECRET, { expiresIn: 300 });

        // Return success response with the token
        return { status: 200, message: 'Verification successful', token: token };

    } catch (error) {
        // Handle any errors that occur during the process
        return { status: 500, message: error.message };
    }
}

/**
 * Resets a user's password given a valid JWT token and user object.
 * 
 * @async
 * @function resetPassword
 * @param {string} token - JWT token used to authenticate the user.
 * @param {Object} user - The user object containing the new user details.
 * @param {string} user.password - The new password of the user.
 * @returns {Promise<Object>} An object containing the status code and message indicating the result of the operation.
 * 
 * @throws {Error} Throws an error if there is an issue with token verification or database access.
 * 
 * @description This function verifies the JWT token to authenticate the user, retrieves the user record from the database,
 * and updates the user details with the new password. If the user is not found, it returns a 400 status error. If the update
 * is successful, it returns a 200 status with a success message. Other errors result in a 500 status error.
 */
exports.resetPassword = async (token, user) => {
    try {
        // Verify the token using JWT to authenticate the user
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find the user based on the username in the token
        const userRecord = await User.findByPk(decoded.id); 

        // Check if the user exists; if not, return a 400 status
        if (!userRecord) {
            return { status: 400, message: 'User not found' }
        }

        // Hash the new password using bcrypt
        const passwordHash = await bcrypt.hash(user.password, 10); // 10 salt rounds

        // Update user details in the database with the new password
        await userRecord.update({ 
            password: passwordHash 
        });

         // Respond with success message
        return {
            status: 200,
            message: "Password updated successfully"
        };
    } catch (error) {
        // Handle any errors during login process
        return { status: 500, message: error.message };
    }
}