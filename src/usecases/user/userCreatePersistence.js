const bcrypt = require('bcryptjs');
const User = require('../../framework/db/postgresql/userModel');


/**
 * Persists a new user in the database.
 *
 * @async
 * @function userCreatePersistence
 * @param {Object} user - The user object containing user details.
 * @param {string} user.username - The username of the user.
 * @param {string} user.email - The email of the user.
 * @param {string} user.password - The password of the user.
 * @returns {Promise<Object>} The result object containing the status code and message.
 * @throws {Error} Throws an error if there is an issue with user creation.
 *
 * @description This function hashes the user's password and attempts to create a new user record
 * in the database. If a user with the provided email already exists, it returns a 400 status error.
 * If the creation is successful, it returns a 201 status with a success message. If a duplicate key
 * error occurs, it returns a 400 status error, indicating the user already exists. Other errors
 * result in a 500 status error.
 */
exports.userCreatePersistence = async (user) => {
    try {
        // Hash the password
        const passwordHash = await bcrypt.hash(user.password, 10); // 10 salt rounds

        // Search for the user in the database
        const userRecord = await User.findOne({ where: { email: user.email }});

        // If the user already exists, return a 400 error
        if (userRecord) {
            return { status: 400, message: "User already exists" };
        }

        // If the user does not exist, create it
        await User.create({
            username: user.username,
            email: user.email,
            password: passwordHash
        });

        // Return success message
        return { status: 201,message: "User registered successfully" };
    } catch (err) {
        // If the error is a duplicate key error, return a 400 error
        // This is to prevent users from registering multiple times
        if (err.code === 11000) {
            return { status: 400, message: "User already exists" };
        }
        // If the error is not a duplicate key error, return a 500 error
        // This is to prevent users from registering multiple times
        else {
            return {status: 500, message: err.message };
        }
    }
}