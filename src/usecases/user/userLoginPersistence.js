const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../framework/db/postgresql/userModel');

/**
 * Authenticates a user using the provided email and password.
 *
 * @async
 * @function userLoginPersistence
 * @param {Object} user - The user object containing email and password.
 * @param {string} user.email - The email of the user.
 * @param {string} user.password - The password of the user.
 * @returns {Promise<Object>} An object containing the status code, message, and JWT token if successful.
 * @throws {Error} Throws an error if there is an issue with user authentication.
 *
 * @description This function searches for the user in the database using the provided email. If the user is found,
 * it validates the provided password against the stored hashed password. If the credentials are valid, a JWT token is
 * generated and returned with a 200 status. If the user is not found or the password is incorrect, it returns a 400 status
 * with an appropriate error message. Any other errors encountered during the process result in a 500 status with the error message.
 */
exports.userLoginPersistence = async (user) => {
    try {
        // Search for the user in the database
        const userRecord = await User.findOne({ where: { email: user.email }});

        // Validate if user exists
        if (!userRecord) {
            return { status: 400, message: 'User not found' };
        }

        // Compare provided password with stored password
        const isPasswordCorrect = await bcrypt.compare(user.password, userRecord.password);

        // If passwords do not match, return an error
        if (!isPasswordCorrect) {
            return { status: 400, message: 'Invalid credentials' };
        }

        // Generate a JWT token for the user
        const token = jwt.sign({id: userRecord.id, email: userRecord.email, role: "User"}, process.env.JWT_SECRET, {expiresIn: '1d'});

        // Return success response with token
        return { status: 200, message: 'User logged in successfully', token: token };
    } catch (error) {
        // Handle any errors during login process
        // e.g. database connection errors
        return { status: 500, message: error.message };
    }
}