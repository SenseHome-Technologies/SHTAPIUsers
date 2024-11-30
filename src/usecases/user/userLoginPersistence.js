const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../framework/db/postgresql/userModel');

exports.userLoginPersistence = async (user) => {
    try {
        // Search for the user in the database
        const userRecord = await User.findOne({ where: { email: user.email }});

        // Validate if user exists
        if (!userRecord) {
            return {
                status: 400,
                message: 'User not found'
            };
        }

        // Compare provided password with stored password
        const isPasswordCorrect = await bcrypt.compare(user.password, userRecord.password);

        // If passwords do not match, return an error
        if (!isPasswordCorrect) {
            return {
                status: 400,
                message: 'Invalid credentials'
            };
        }

        // Generate a JWT token for the user
        const token = jwt.sign({id: userRecord.id, email: userRecord.email, role: "User"}, process.env.JWT_SECRET, {expiresIn: '1d'});

        // Return success response with token
        return {
            status: 200,
            message: 'User logged in successfully',
            token: token
        };
    } catch (error) {
        // Handle any errors during login process
        return {
            status: 500,
            message: error.message
        };
    }
}