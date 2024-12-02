exports.UserEntity = class UserEntity {
    /**
     * @class UserEntity
     * @param {Object} user - Object with user properties
     * @prop {String} id - User id
     * @prop {String} username - Username of the user
     * @prop {String} email - Email of the user
     * @prop {String} password - Password of the user
     * @prop {String} profilephoto - Profile photo of the user
     * @prop {String} phonetoken - Phonenumber token of the user
     * @prop {String} verificationcode - Verification code of the user
     * @prop {Date} codeexpiry - Expiration date of the verification code
     */
    constructor(user) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.password = user.password;
        this.profilephoto = user.profilephoto;
        this.phonetoken = user.phonetoken;
        this.verificationcode = user.verificationcode;
        this.codeexpiry = user.codeexpiry;
    }
}