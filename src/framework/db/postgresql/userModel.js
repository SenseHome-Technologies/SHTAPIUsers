'use strict';

const { Sequelize } = require('sequelize');
const db = require('./config');

const User = db.define('user', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    phonenumber: Sequelize.STRING,
    profilephoto: Sequelize.STRING,
    phonetoken: Sequelize.STRING,
    verificationcode: Sequelize.STRING,
    codeexpiry: Sequelize.DATE
}, {
    tableName: 'users',
    timestamps: false
});

module.exports = User;
