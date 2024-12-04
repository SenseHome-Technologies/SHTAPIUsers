const jwt = require('jsonwebtoken');
const User = require('../../framework/db/postgresql/userModel');

/**
 * Updates a user's information in the database based on the provided JWT token and user details.
 *
 * @async
 * @function userEditPersistence
 * @param {string} token - JWT token used to authenticate and identify the user to be updated.
 * @param {Object} user - The user object containing updated user details.
 * @param {string} user.id - The id of the user.
 * @param {string} user.username - The new username of the user.
 * @param {string} user.email - The new email of the user.
 * @param {string} user.phonenumber - The new phone number of the user.
 * @param {string} user.profilephoto - The new profile photo of the user.
 * @param {string} user.phonetoken - The new phone token of the user.
 * @returns {Promise<Object>} An object containing the status code and message indicating the result of the operation.
 *
 * @throws {Error} Will throw an error if there's an issue with token verification or database access.
 *
 * @description This function verifies the JWT token to authenticate the user, retrieves the user record from the database,
 * and updates it with the provided user details. It returns a 200 status on successful update or a 400 status if the user
 * is not found. Any errors encountered during the process result in a 500 status with the error message.
 */
exports.userEditPersistence = async (token, user) => {
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

        // Update user details in the database with the provided user information
        await userRecord.update({
            username: user.username,
            email: user.email,
            phonenumber: user.phonenumber,
            profilephoto: user.profilephoto,
            phonetoken: user.phonetoken
        });

        // Return a success response with a 200 status indicating the user was updated successfully
        return { status: 200, message: "User updated successfully" };

    } catch (error) {
        // Catch and return any errors that occur during the update process with a 500 status
        return { status: 500, message: error.message };
    }
}