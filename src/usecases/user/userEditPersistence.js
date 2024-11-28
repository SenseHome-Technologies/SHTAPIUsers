const jwt = require('jsonwebtoken');
const User = require('../../framework/db/postgresql/userModel');

exports.userEditPersistence = async (token, user) => {
    try {
        // Verify the token using JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user based on the username in the token
        const userRecord = await User.findOne({id: decoded.id}).lean();

        if (!userRecord) {
            return ({
                status: 400,
                message: 'User not found'
            });
        }

        // Update user details in the database
        await User.updateOne(
            {id: userRecord.id},
            {username: user.username, email: user.email, phonenumber: user.phonenumber, profilephoto: user.profilephoto, phonetoken: user.phonetoken}
        );

         // Respond with success message
        return ({
            status: 200,
            message: "User updated successfully"
        });

    } catch (error) {
        // Handle any errors during login process
        return ({
            status: 500,
            message: error.message
        });
    }
}