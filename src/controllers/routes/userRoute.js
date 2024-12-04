'use strict';
const userInteractorPostgres = require('../../usecases/user/userInteractorPostgres');
const { userLoginPersistence } = require('../../usecases/user/userLoginPersistence');
const { userCreatePersistence } = require('../../usecases/user/userCreatePersistence');
const userForgetPasswordPersistence = require('../../usecases/user/userForgetPasswordPersistence');
const { userEditPersistence } = require('../../usecases/user/userEditPersistence');
const { userDeletePersistence } = require('../../usecases/user/userDeletePersistence');
const router = require('express').Router();


/**
 * @api {post} /api/user/login User Login
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
 *
 * @apiDescription This endpoint allows a user to log in by providing their email and password. If the credentials are valid,
 * a JWT token is returned to the user.
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
 * @api {post} /api/user/register Register User
 * @apiName Register User
 * @apiGroup User
 * @apiParam {String} username Username of the user
 * @apiParam {String} password Password of the user
 * @apiParam {String} email Email of the user
 * @apiSuccess {String} message User registered successfully
 * @apiError {String} message Username, email, or password missing
 * @apiError {String} message Invalid email or password
 * @apiError {String} message User already exists
 * @apiError {String} message Error registering user
 *
 * @apiDescription This endpoint allows a user to register by providing their username, email, and password. If the credentials are valid,
 * a JWT token is returned to the user.
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
 * @api {post} /api/user/forgot-password Forgot Password
 * @apiName Forgot Password
 * @apiGroup User
 * @apiParam {String} email Email of the user
 * @apiSuccess {String} message Password reset link sent to the user via email
 * @apiError {String} message Invalid email
 * @apiError {String} message Error sending password reset link
 *
 * @apiDescription This endpoint allows a user to request a password reset link to be sent to their email.
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
 * @api {post} /api/user/verifyCode Verify Code
 * @apiName Verify Code
 * @apiGroup User
 * @apiParam {String} email Email of the user
 * @apiParam {String} verificationcode Verification code provided by the user
 * @apiSuccess {String} message Verification code is valid
 * @apiSuccess {String} token JWT token for the user
 * @apiError {String} message Invalid verification code
 * @apiError {String} message Error verifying the verification code
 *
 * @apiDescription This endpoint verifies the verification code provided by the user.
 */
router.route('/user/verifyCode').post(
    async (req, res) => {
        // Destructure oldPassword and newPassword from request body
        const {email, verificationcode} = req.body;
        
        try {
            // 
            const user = await userInteractorPostgres.verifyCode({userForgetPasswordPersistence}, {email, verificationcode});
            // Send the response with the status and user data
            res.status(user.status).send({
                message: user.message,
                token: user.token
            });
        } catch (err) {
            // Log any errors that occur during the password change process
            console.log(err);
            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
)

/**
 * @api {post} /api/user/reset-password Reset Password
 * @apiName ResetPassword
 * @apiGroup User
 * @apiHeader {String} token JWT token for the user
 * @apiParam {String} password New password of the user
 * @apiSuccess {String} message Password updated successfully
 * @apiError {String} message Password is required
 * @apiError {String} message Token is missing
 * @apiError {String} message Invalid token
 * @apiError {String} message Error updating password
 *
 * @apiDescription This endpoint allows a user to reset their password by providing a valid JWT token and a new password.
 */
router.route('/user/reset-password').post(
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Destructure new password from request body
        const {password} = req.body;
        
        try {
            // Use userInteractorPostgres to reset the password
            const user = await userInteractorPostgres.resetPassword({userForgetPasswordPersistence}, {token, password});
            // Send the response with the status and user data
            res.status(user.status).send(user);
        } catch (err) {
            // Log any errors that occur during the password reset process
            console.log(err);
            // Rethrow the error to be handled by the caller
            throw err;
        }
    }
)

/**
 * @api {put} /api/user/edit Edit User
 * @apiName Edit User
 * @apiGroup User
 * @apiHeader {String} token JWT token for the user
 * @apiParam {String} id Id of the user
 * @apiParam {String} username New username of the user
 * @apiParam {String} email New email of the user
 * @apiParam {String} profilephoto New profile photo of the user
 * @apiParam {String} phonetoken New phone token of the user
 * @apiSuccess {String} message User edited successfully
 * @apiError {String} message Token is missing
 * @apiError {String} message Invalid token
 * @apiError {String} message Error editing user
 *
 * @apiDescription This endpoint allows a user to edit their information in the database.
 */
router.route('/user/edit').put(
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Destructure user details from request body
        const {id, username, email, profilephoto, phonetoken} = req.body;

        try {
            // Attempt to edit user details using userInteractorPostgres
            const user = await userInteractorPostgres.edit({userEditPersistence}, {token, id, username, email, profilephoto, phonetoken});
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
 * @api {delete} /api/user/delete Delete User
 * @apiName DeleteUser
 * @apiGroup User
 * @apiHeader {String} token JWT token for the user
 * @apiParam {String} id Id of the user to be deleted
 * @apiSuccess {String} message User deleted successfully
 * @apiError {String} message Id is required
 * @apiError {String} message Invalid user ID
 * @apiError {String} message User not found
 * @apiError {String} message Error during user deletion
 *
 * @apiDescription This endpoint allows a user to be deleted from the database using a JWT token and user ID.
 */
router.route('/user/delete').delete(
    async (req, res) => {
        // Extract token from request headers
        const token = req.headers['token'];
        // Destructure user details from request body
        const {id} = req.body;
        
        try {
            // Attempt to delete the user using userInteractorPostgres
            const user = await userInteractorPostgres.delete({userDeletePersistence}, {token, id});
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
