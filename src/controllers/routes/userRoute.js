'use strict';
const userInteractorPostgres = require('../../usecases/user/userInteractorPostgres');
const { userLoginPersistence } = require('../../usecases/user/userLoginPersistence');
const { userCreatePersistence } = require('../../usecases/user/userCreatePersistence');
const userForgetPasswordPersistence = require('../../usecases/user/userForgetPasswordPersistence');
const { userEditPersistence } = require('../../usecases/user/userEditPersistence');
const { userDeletePersistence } = require('../../usecases/user/userDeletePersistence');
const router = require('express').Router();


/**
 * @api {post} /user/login User Login
 * @apiName UserLogin
 * @apiGroup User
 * @apiParam {String} email Email of the user
 * @apiParam {String} password Password of the user
 * @apiSuccess {String} message User logged in successfully
 * @apiSuccess {String} token JWT token for the user
 * @apiError {String} message Email or password missing
 * @apiError {String} message Invalid credentials
 * @apiError {String} message User not found
 * @apiError {String} message Error logging in
 */
router.route('/user/login').post(
    // Define an asynchronous function to handle the login route
    async (req, res) => {
        // Extract email and password from the request body
        const {email, password} = req.body;

        try {
            // Use userInteractorPostgres to attempt login with the provided email and password
            const user = await userInteractorPostgres.login({userLoginPersistence}, {email, password});
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


/**
 * @api {post} /user/register Register
 * @apiName Register
 * @apiGroup User
 * @apiParam {String} username Username of the user
 * @apiParam {String} password Password of the user
 * @apiParam {String} email Email of the user
 * @apiSuccess {String} message User registered successfully
 * @apiError {String} message Username or password is missing
 * @apiError {String} message Username already exists
 * @apiError {String} message Password must be at least 8 characters long
 * @apiError {String} message Error creating user
 */
router.route('/user/register').post(
    async (req, res) => {
        // Extract user details from the request body
        const {username, password, email} = req.body;

        try {
            // Use userInteractorPostgres to register the user
            const user = await userInteractorPostgres.register({userCreatePersistence}, {username, password, email});
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

/**
 * @api {post} /user/forgot-password Forgot Password
 * @apiName Forgot Password
 * @apiGroup User
 * @apiParam {String} email Email of the user
 * @apiSuccess {String} message Password reset link sent successfully
 * @apiError {String} message User not found
 * @apiError {String} message Error sending email
 */
router.route('/user/forgot-password').post(
    async (req, res) => {
        // Destructure oldPassword and newPassword from request body
        const {email} = req.body;
        
        try {
            // 
            const user = await userInteractorPostgres.forgotPassword({userForgetPasswordPersistence}, {email});
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

/**
 * @api {post} /user/verifyCode Verify Code
 * @apiName Verify Code
 * @apiGroup User
 * @apiParam {String} email Email of the user
 * @apiParam {String} verificationcode Verification code sent to the user via email
 * @apiSuccess {String} message Verification successful
 * @apiSuccess {String} token JWT token for the user
 * @apiError {String} message Invalid verification code
 * @apiError {String} message Error verifying user
 */
router.route('/user/verifyCode').post(
    async (req, res) => {
        // Destructure oldPassword and newPassword from request body
        const {email, verificationcode} = req.body;
        
        try {
            // 
            const user = await userInteractorPostgres.verifyCode({userForgetPasswordPersistence}, {email, verificationcode});
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

/**
 * @api {post} /user/reset-password Reset Password
 * @apiName Reset Password
 * @apiGroup User
 * @apiHeader {String} token JWT token for the user
 * @apiParam {String} password New password of the user
 * @apiSuccess {String} message Password reset successfully
 * @apiError {String} message Token is missing
 * @apiError {String} message Invalid token
 * @apiError {String} message Error resetting password
 */
router.route('/user/reset-password').post(
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Destructure newPassword from request body
        const {password} = req.body;
        
        try {
            // 
            const user = await userInteractorPostgres.resetPassword({userForgetPasswordPersistence}, {token, password});
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

/**
 * @api {put} /user/edit Edit User
 * @apiName Edit User
 * @apiGroup User
 * @apiHeader {String} token JWT token for the user
 * @apiParam {String} username Username of the user
 * @apiParam {String} email Email of the user
 * @apiParam {String} phonenumber Phonenumber of the user
 * @apiParam {String} profilephoto Profile photo of the user
 * @apiParam {String} phonetoken Phonenumber token of the user
 * @apiSuccess {String} message User updated successfully
 * @apiError {String} message Token is missing
 * @apiError {String} message Invalid token
 * @apiError {String} message Error updating user
 */
router.route('/user/edit').put(
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Destructure user details from request body
        const {username, email, phonenumber, profilephoto, phonetoken} = req.body;

        try {
            // Attempt to edit user details using userInteractorPostgres
            const user = await userInteractorPostgres.edit({userEditPersistence}, {token, username, email, phonenumber, profilephoto, phonetoken});
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

/**
 * @api {delete} /user/delete Delete User
 * @apiName Delete User
 * @apiGroup User
 * @apiHeader {String} token JWT token for the user
 * @apiSuccess {String} message User deleted successfully
 * @apiError {String} message Token is missing
 * @apiError {String} message Invalid token
 * @apiError {String} message Error deleting user
 */
router.route('/user/delete').delete(
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        
        try {
            // Attempt to delete the user using userInteractorPostgres
            const user = await userInteractorPostgres.delete({userDeletePersistence}, {token});
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
