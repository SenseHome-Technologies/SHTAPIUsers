'use strict';

const {UserEntity} = require('../../entities/UserEntity');

/**
 * Logs in a user with the provided email and password.
 *
 * @async
 * @function login
 * @param {Object} userLoginPersistence - The user login persistence object.
 * @param {Object} user - The user object containing email and password.
 * @param {String} user.email - The email of the user.
 * @param {String} user.password - The password of the user.
 * @returns {Promise<Object>} The result of the login operation.
 * @throws {Error} Will throw an error if there's an issue with login persistence.
 *
 * @description This function creates a UserEntity with the provided email and password,
 * validates the user by checking if email and password are provided, and attempts to persist
 * the login using the provided userLoginPersistence. The result of the login operation is
 * returned as a Promise.
 */
exports.login = async ({userLoginPersistence}, {email, password}) => {
    try {
        // Create a new UserEntity with provided email and password
        const user = new UserEntity({email, password});

        // Validate the user
        // Ensure that email and password are provided
        if (!email || !password) {
            return { status: 400, message: 'Email and password are required' };
        }

        // Attempt to persist user login
        // This will check if the user exists and if the password is correct
        const result = await userLoginPersistence(user);

        // Return the login result
        // This will be a 200 status with the user data and a JWT token
        return result;
    } catch (err) {
        // Log any errors that occur during the login process
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err;
    }
}

/**
 * Registers a user with the provided email and password.
 *
 * @async
 * @function register
 * @param {Object} userCreatePersistence - The user create persistence object.
 * @param {Object} user - The user object containing username, email, and password.
 * @param {String} user.username - The username of the user.
 * @param {String} user.email - The email of the user.
 * @param {String} user.password - The password of the user.
 * @returns {Promise<Object>} The result of the registration operation.
 * @throws {Error} Will throw an error if there's an issue with user creation persistence.
 *
 * @description This function creates a UserEntity with the provided username, email, and password,
 * validates the user by ensuring that all required fields are provided and the password is at least
 * 8 characters long, and attempts to persist the registration using the provided userCreatePersistence.
 * The result of the registration operation is returned as a Promise.
 */
exports.register = async ({userCreatePersistence}, {username, email, password}) => {
    try {
        // Create a new UserEntity with the provided details
        // This includes the username, email, and password
        const user = new UserEntity({username, email, password});

        // Validate the user
        // Ensure that username, email, and password are provided
        if (!username || !email || !password) {
            return { status: 400, message: 'Username, email, and password are required' };
        }

        // Validate the user
        // Ensure that the password is at least 8 characters long
        if (password.length < 8) {
            return { status: 400, message: 'Password must be at least 8 characters long' };
        }

        // Attempt to persist the user registration
        // This will check if the user already exists and create a new user if not
        const result = await userCreatePersistence(user);

        // Return the result of the registration
        // This will be a 201 status with the user data and a JWT token
        return result;
    } catch (err) {
        // Log any errors that occur during the registration process
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err;
    }
}

/**
 * Persists a user's password reset request in the database and sends an email to the user with a verification code.
 * 
 * @async
 * @function forgotPassword
 * @param {Object} userForgetPasswordPersistence - The user forgot password persistence object.
 * @param {Object} email - The email of the user.
 * @returns {Promise<Object>} The result object containing the status code and message.
 * @throws {Error} Throws an error if there is an issue with user creation.
 *
 * @description This function searches for the user in the database, generates a verification code, and sends an email to the user with the verification code.
 * If the user is not found, it returns a 404 status error. If the creation is successful, it returns a 200 status with a success message. If a duplicate key
 * error occurs, it returns a 400 status error, indicating the user already exists. Other errors result in a 500 status error.
 */
exports.forgotPassword = async ({userForgetPasswordPersistence}, {email}) => {
    try {
        // Create a new UserEntity with the provided email
        // This is used to persist the forgot password request
        const user = new UserEntity({email});

        // Validate the user
        // Ensure that an email is provided
        if (!email) {
            return { status: 400, message: 'Email is required' };
        }

        // Attempt to persist the forgot password request
        // This will search for the user and send an email with a verification code
        const result = await userForgetPasswordPersistence.forgotPassword(user);

        // Return the result of the forgot password process
        // This will be a 200 status with a success message
        return result;
    } catch (err) {
        // Rethrow any errors that occur during the process
        throw err;
    }
}

/**
 * Verifies a user's verification code.
 *
 * @async
 * @function verifyCode
 * @param {Object} userForgetPasswordPersistence - The persistence object for handling forgot password operations.
 * @param {Object} user - The user object containing email and verification code.
 * @param {string} user.email - The email of the user.
 * @param {string} user.verificationcode - The verification code provided by the user.
 * @returns {Promise<Object>} An object containing the status code and message indicating the result of the verification.
 * 
 * @throws {Error} Throws an error if there is an issue with verification process.
 *
 * @description This function verifies the user's email and verification code by checking if they are provided
 * and uses the userForgetPasswordPersistence to validate the code. It returns a status of 400 if inputs are missing,
 * otherwise returns the result of the verification process.
 */
exports.verifyCode = async ({userForgetPasswordPersistence}, {email, verificationcode}) => {
    try {
        // Instantiate UserEntity with email and verification code
        const user = new UserEntity({email, verificationcode});

        // Validate inputs: email and verification code must be provided
        if (!email || !verificationcode) {
            return { status: 400, message: 'Email and verification code are required' };
        }

        // Verify the code using userForgetPasswordPersistence
        const result = await userForgetPasswordPersistence.verifyCode(user);

        // Return the result of the verification process
        return result;
    } catch (err) {
        // Propagate any errors encountered during verification
        throw err;
    }
}

/**
 * Resets a user's password given a valid JWT token and user object.
 * 
 * @async
 * @function resetPassword
 * @param {Object} userForgetPasswordPersistence - The persistence object for handling forgot password operations.
 * @param {string} token - JWT token used to authenticate the user.
 * @param {Object} user - The user object containing the new password.
 * @param {string} user.password - The new password of the user.
 * @returns {Promise<Object>} An object containing the status code and message indicating the result of the operation.
 * 
 * @throws {Error} Throws an error if there is an issue with token verification or database access.
 *
 * @description This function verifies the JWT token to authenticate the user, retrieves the user record from the database,
 * and updates the user details with the new password. If the user is not found, it returns a 400 status error. If the update
 * is successful, it returns a 200 status with a success message. Other errors result in a 500 status error.
 */
exports.resetPassword = async ({userForgetPasswordPersistence}, {token, password}) => {
    try {
        // Create a UserEntity with the new password
        const user = new UserEntity({password});

        // Validate the password
        // Check if password is provided
        if (!password) {
            return { status: 400, message: 'Password is required' };
        }

        // Check if the password meets the minimum length requirement
        if (password.length < 8) {
            return { status: 400, message: 'Password must be at least 8 characters long' };
        }

        // Reset the password using userForgetPasswordPersistence
        // Pass the token and user entity to the persistence method
        const result = await userForgetPasswordPersistence.resetPassword(token, user);

        // Return the result of the password reset process
        return result;
    } catch (err) {
        // Propagate any errors encountered during the process
        throw err;
    }
}

/**
 * Edits a user's information in the database based on the provided JWT token and user details.
 *
 * @async
 * @function edit
 * @param {Object} userEditPersistence - The persistence object for handling user edit operations.
 * @param {string} token - JWT token used to authenticate and identify the user to be edited.
 * @param {string} id - The id of the user.
 * @param {string} username - The new username of the user.
 * @param {string} email - The new email of the user.
 * @param {string} profilephoto - The new profile photo of the user.
 * @param {string} phonetoken - The new phone token of the user.
 * @returns {Promise<Object>} An object containing the status code and message indicating the result of the operation.
 *
 * @throws {Error} Throws an error if there's an issue with token verification or database access.
 *
 * @description This function creates a UserEntity with the provided user details, validates required fields,
 * and attempts to edit the user using userEditPersistence. If the token is valid and the user is found, it
 * updates the user details and returns a 200 status with a success message. Missing fields result in a 400
 * status error. Any errors encountered during the process result in a 500 status error.
 */
exports.edit = async ({userEditPersistence}, {token, id, username, email, profilephoto, phonetoken}) => {
    try {
        // Create a new UserEntity with the provided user details
        // This is used to pass the user details to the userEditPersistence method
        const user = new UserEntity({id, username, email, profilephoto, phonetoken});

        // Validate all required fields of the user
        // Ensure that the id, username and email are provided
        if (!id || !username || !email) {
            return { status: 400, message: 'Id, username and email are required'};
        }

        // Attempt to edit the user using userEditPersistence
        // This will verify the token, retrieve the user record from the database,
        // and update the user details if the user is found
        const result = await userEditPersistence(token, user);

        // Return the result of the user edit
        // This will be a 200 status with a success message if the edit is successful
        // Otherwise, it will be a 400 status with an error message
        return result;
    } catch (err) {
        // Rethrow any errors that occur during the user edit process
        // This allows the error to be handled by the caller
        throw err;
    }
}

/**
 * Deletes a user from the database based on the provided JWT token.
 *
 * @async
 * @function delete
 * @param {Object} userDeletePersistence - The user delete persistence object.
 * @param {string} token - The JWT token used to identify the user to be deleted.
 * @param {string} id - The id of the user to be deleted.
 * @returns {Promise<Object>} The result object containing the status code and message.
 * @throws {Error} Throws an error if there is an issue with user deletion.
 *
 * @description This function verifies the JWT token to authenticate the user, retrieves the user record from the database,
 * and deletes it if found. If the user is not found, it returns a 400 status error. Any errors encountered during the process
 * result in a 500 status error.
 */
exports.delete = async ({userDeletePersistence}, {token, id}) => {
    try {
        // Create a new UserEntity with the provided id
        const user = new UserEntity({id});

        // Validate all required fields of the user
        // Ensure that the id is provided
        if (!id) {
            return { status: 400, message: 'Id is required'};
        }

        // Attempt to delete the user using the provided persistence method
        const result = await userDeletePersistence(token, user);

        // Check the result of the deletion process
        // Return the result of the user deletion
        return result;
    } catch (err) {
        // Log any errors that occur during the user deletion process
        console.error('Error during user deletion:', err);

        // Rethrow the error to be handled by the caller
        throw err;
    }
}