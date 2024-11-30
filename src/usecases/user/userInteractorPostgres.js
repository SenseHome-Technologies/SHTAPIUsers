'use strict';

const {UserEntity} = require('../../entities/UserEntity');

exports.login = async ({userLoginPersistence}, {email, password}) => {
    try {
        // Create a new UserEntity with provided email and password
        const user = new UserEntity({email, password});

        // Validate the user
        if (!email || !password) {
            return {
                status: 400,
                message: 'Email and password are required'
            };
        }

        // Attempt to persist user login and retrieve result
        const result = await userLoginPersistence(user);

        // Return the login result
        return result;
    } catch (err) {
        // Log any errors that occur during the login process
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err;
    }
}

exports.register = async ({userCreatePersistence}, {username, email, password}) => {
    try {
        // Create a new UserEntity with the provided details
        const user = new UserEntity({username, email, password});

        // Validate the user
        if (!username || !email || !password) {
            return {
                status: 400,
                message: 'Username, email, and password are required'
            };
        }

        // Attempt to persist the user registration
        const result = await userCreatePersistence(user);

        // Return the result of the registration
        return result;
    } catch (err) {
        // Log any errors that occur during the registration process
        console.error(err);
        // Rethrow the error to be handled by the caller
        throw err;
    }
}

exports.forgotPassword = async ({userForgetPasswordPersistence}, {email}) => {
    try {
        // Create a new UserEntity with the provided details
        const user = new UserEntity({email});

        // Validate the user        
        if (!email) {
            return {
                status: 400,
                message: 'Email is required'
            };
        }

        // Attempt to persist the user forgot password
        const result = await userForgetPasswordPersistence.forgotPassword(user);

        // Return the result
        return result;
    } catch (err) {
        // Rethrow any errors that occur during the process
        throw err;
    }
}

exports.verifyCode = async ({userForgetPasswordPersistence}, {email, verificationcode}) => {
    try {
        // Create a new UserEntity with the provided details
        const user = new UserEntity({email, verificationcode});

        // Validate the user        
        if (!email || !verificationcode) {
            return {
                status: 400,
                message: 'Email and verification code are required'
            };
        }

        // Attempt to persist the user forgot password
        const result = await userForgetPasswordPersistence.verifyCode(user);

        // Return the result
        return result;
    } catch (err) {
        // Rethrow any errors that occur during the process
        throw err;
    }
}

exports.resetPassword = async ({userForgetPasswordPersistence}, {token, password}) => {
    try {
        // Create a new UserEntity with the provided details
        const user = new UserEntity({password});

        // Validate the user        
        if (!password) {
            return {
                status: 400,
                message: 'Password is required'
            };
        }

        if (password.length < 8) {
            return {
                status: 400,
                message: 'Password must be at least 8 characters long'
            };
        }

        // Attempt to persist the user forgot password
        const result = await userForgetPasswordPersistence.resetPassword(token, user);

        // Return the result
        return result;
    } catch (err) {
        // Rethrow any errors that occur during the process
        throw err;
    }
}

exports.edit = async ({userEditPersistence}, {token, username, email, phonenumber, profilephoto, phonetoken}) => {
    try {
        // Create a new UserEntity with provided user details
        const user = new UserEntity({username, email, phonenumber, profilephoto, phonetoken});

        // Validate all required fields of the user
        if (!username || !email) {
            return {
                status: 400,
                message: 'All fields are required'
            };
        }

        // Attempt to edit the user using userEditPersistence
        const result = await userEditPersistence(token, user);

        // Return the result of the user edit
        return result;
    } catch (err) {
        // Rethrow any errors that occur during the user edit process
        throw err;
    }
}

exports.delete = async ({userDeletePersistence}, {token}) => {
    try {
        // Attempt to delete the user using userDeletePersistence
        const result = await userDeletePersistence(token);

        // Return the result of the user deletion
        return result;
    } catch (err) {
        // Rethrow any errors that occur during the user deletion process
        throw err;
    }
}