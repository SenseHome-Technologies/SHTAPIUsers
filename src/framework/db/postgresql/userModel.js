'use strict';

const { DataTypes } = require('sequelize');
const db = require('./config');

const User = db.define('user', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phonenumber: DataTypes.STRING,
    profilephoto: DataTypes.STRING,
    phonetoken: DataTypes.STRING,
    verificationcode: DataTypes.STRING,
    codeexpiry: DataTypes.DATE
}, {
    tableName: 'users',
    timestamps: false
});

module.exports = User;
