const bcrypt = require('bcryptjs');
const User = require('../../framework/db/postgresql/userModel');


exports.userCreatePersistence = async (user) => {
    try {
        const passwordHash = await bcrypt.hash(user.password, 10); // 10 salt rounds
        
        // Search for the user in the database
        const userRecord = await User.findOne({ where: { email: user.email }});

        if (userRecord) {
            return ({
                status: 400,
                message: "User already exists"
            });
        }

        // if the user does not exist, create it
        await User.create({
            username: user.username,
            email: user.email,
            password: passwordHash
        });

        return ({
            status: 201,
            message: "User registered successfully"
        })
    } catch (err) {
        // if the error is a duplicate key error, return a 400 error
        // This is to prevent users from registering multiple times
        if (err.code === 11000) {
            return ({
                status: 400,
                message: "User already exists"
            });
        }
        // if the error is not a duplicate key error, return a 500 error
        // This is to prevent users from registering multiple times
        else {
            return ({
                status: 500,
                message: err.message
            });
        }
    }
}