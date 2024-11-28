exports.UserEntity = class UserEntity {
    constructor(user) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.password = user.password;
        this.phonenumber = user.phonenumber;
        this.profilephoto = user.profilephoto;
        this.phonetoken = user.phonetoken;
    }
}