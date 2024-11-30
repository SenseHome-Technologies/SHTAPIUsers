const jwt = require('jsonwebtoken');
const User = require('../../framework/db/postgresql/userModel');

exports.userDeletePersistence = async (token, user) => {
    try {
        // Verify the token using JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user based on the username in the token
        const userRecord = await User.findByPk(decoded.id);

        if (!userRecord) {
            return { status: 400, message: 'User not found' };
        }

        // Delete user details in the database
        await user.destroy();

         // Respond with success message
        return { status: 204, message: "User deleted successfully" };
    } catch (error) {
        // Handle any errors during login process
        return { status: 500, message: error.message };
    }
}