'use strict';
const userInterfactorPostgres = require('../../usecases/user/userInterfactorPostgres');
const { userLoginPersistence } = require('../../usecases/user/userLoginPersistence');
const { userCreatePersistence } = require('../../usecases/user/userCreatePersistence');
const { userForgetPasswordPersistence } = require('../../usecases/user/userForgetPasswordPersistence');
const { userEditPersistence } = require('../../usecases/user/userEditPersistence');
const { userDeletePersistence } = require('../../usecases/user/userDeletePersistence');
const router = require('express').Router();

router.route('/login').post(
    // Define an asynchronous function to handle the login route
    async (req, res) => {
        // Extract username and password from the request body
        const {email, password} = req.body;

        try {
            // Use userInteractorPostgres to attempt login with the provided username and password
            const user = await userInterfactorPostgres.login({userLoginPersistence}, {email, password});
            
            // Send the response with the status and user data
            res.status(user.status).send(user);
        } catch (err) {
            // Log any errors that occur during the login process
            console.log(err);

            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
)

router.route('/register').post(
    async (req, res) => {
        // Extract user details from the request body
        const {firstname, lastname, username, password, email, birthdate, profilepicture} = req.body;

        try {
            // Use userInteractorPostgres to register the user
            const user = await userInterfactorPostgres.register({userCreatePersistence}, {firstname, lastname, username, password, email, birthdate, profilepicture});
            
            // Send the response with the status and user data
            res.status(user.status).send(user)
        } catch (err) {
            // Log any errors that occur during the registration process
            console.log(err);

            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
)

router.route('/changePassword').post(
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Destructure oldPassword and newPassword from request body
        const {oldPassword, newPassword} = req.body;
        
        try {
            // Attempt to change the user's password using the userInteractorPostgres
            const user = await userInterfactorPostgres.changePassword({userForgetPasswordPersistence}, {token, oldPassword, newPassword});
            // Send the response with the status and user data
            res.status(user.status).send(user);
        } catch (err) {
            // Log any errors that occur during the password change process
            console.log(err);
            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
)

router.route('/editUser').put(
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        
        // Destructure user details from request body
        const {firstname, lastname, email, birthdate, profilepicture} = req.body;
        
        try {
            // Attempt to edit user details using userInteractorPostgres
            const user = await userInterfactorPostgres.editUser({userEditPersistence}, {token, firstname, lastname, email, birthdate, profilepicture});
            
            // Send the response with the status and user data
            res.status(user.status).send(user);
        } catch (err) {
            // Log any errors that occur during the edit process
            console.log(err);
            
            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
)

router.route('/deleteUser').delete(
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        
        try {
            // Attempt to delete the user using userInteractorPostgres
            const user = await userInterfactorPostgres.deleteUser({userDeletePersistence}, {token});
            // Send the response with the status and user data
            res.status(user.status).send(user)
        } catch (err) {
            // Log any errors that occur during the deletion process
            console.log(err);
            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
)


module.exports = router;
