const {isValidString} = require("../utils/validation");

class User {

    constructor(socketId, userName) {
        this.id = socketId;
        this.name = userName;
    }

    static isValidUserName(userName) {
        return isValidString(userName);
    }
}

module.exports = {User};