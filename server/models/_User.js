// const {isValidString} = require("../utils/validation");

class User {

    constructor(socketId, userName) {
        this.id = socketId;
        this.name = userName;
        this.room = null;
    }

    assignRoom(room) {
        this.room = room;
    }

}

module.exports = {User};