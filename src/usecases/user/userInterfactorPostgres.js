'use strict';

const {UserEntity} = require('../../entities/UserEntity');

exports.login = async ({userLoginPersistence}, {email, password}) => {
    try {
        // Create a new UserEntity with provided email and password
        const user = new UserEntity({email, password});

        // Validate the user

        // Attempt to persist user login and retrieve result
        const loginResult = await userLoginPersistence(user);

        // Return the login result
        return loginResult;
    } catch (err) {
        // Log any errors that occur during the login process
        console.error(err);

        // Rethrow the error to be handled by the caller
        throw err;
    }
}

exports.register = async ({userCreatePersistence}, {username, email, password, phonenumber}) => {
    try {
        // Create a new UserEntity with the provided details
        const user = new UserEntity({username, email, password, phonenumber});

        // Validate the user

        // Attempt to persist the user registration
        const registeruser = await userCreatePersistence(user);
        // Return the result of the registration
        return registeruser;
    } catch (err) {
        // Log any errors that occur during the registration process
        console.error(err);

        // Rethrow the error to be handled by the caller
        throw err;
    }
}

exports.changePassword = async ({userForgetPasswordPersistence}, {token, oldPassword, newPassword}) => {
    try {
        // TODO: Implement password change functionality
        return ({
            status: 401,
            message: 'Not implemented'
        });
    } catch (err) {
        // Rethrow any errors that occur during the process
        throw err;
    }
}

exports.editUser = async ({userEditPersistence}, {token, username, email, phonenumber, profilephoto, phonetoken}) => {
    try {
        // Create a new UserEntity with provided user details
        const user = new UserEntity({username, email, phonenumber, profilephoto, phonetoken});

        // Validate all required fields of the user 

        // Attempt to edit the user using userEditPersistence
        const editedUser = await userEditPersistence(token, user);

        // Return the result of the user edit
        return editedUser;
    } catch (err) {
        // Rethrow any errors that occur during the user edit process
        throw err;
    }
}

exports.deleteUser = async ({userDeletePersistence}, {token}) => {
    try {
        // Attempt to delete the user using userDeletePersistence
        const deletedUser = await userDeletePersistence(token);

        // Return the result of the user deletion
        return deletedUser;
    } catch (err) {
        // Rethrow any errors that occur during the user deletion process
        throw err;
    }
}