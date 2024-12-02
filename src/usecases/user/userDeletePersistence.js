const jwt = require('jsonwebtoken');
const User = require('../../framework/db/postgresql/userModel');

/**
 * Deletes a user from the database based on the provided JWT token.
 *
 * @async
 * @function userDeletePersistence
 * @param {string} token - JWT token used to authenticate and identify the user to be deleted.
 * @param {Object} user - The user object (not used in the current implementation).
 * @returns {Promise<Object>} An object containing the status code and message indicating the result of the operation.
 *
 * @throws {Error} Will throw an error if there's an issue with token verification or database access.
 *
 * @description This function verifies the JWT token to authenticate the user, retrieves the user record from the database,
 * and deletes it if found. It returns a 204 status on successful deletion or a 400 status if the user is not found.
 * Any errors encountered during the process result in a 500 status with the error message.
 */
exports.userDeletePersistence = async (token, user) => {
    try {
        // Verify the token using JWT to authenticate the user
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verify if the provided user ID matches the user record's ID
        if (user.id !== decoded.id) {
            return { status: 400, message: 'Invalid user ID' };
        }

        // Retrieve the user record from the database using the decoded token's ID
        const userRecord = await User.findByPk(decoded.id);

        // Check if the user record exists; if not, return a 400 status with an error message
        if (!userRecord) {
            return { status: 400, message: 'User not found' };
        }

        // Delete the user record from the database
        await userRecord.destroy();

        // Return a success response with a 204 status indicating the user was deleted successfully
        return { status: 204, message: "User deleted successfully" };
    } catch (error) {
        // Catch and return any errors that occur during the deletion process with a 500 status
        return { status: 500, message: error.message };
    }
}