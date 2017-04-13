const _ = require("lodash");
const {isValidString} = require("../utils/validation");

class Room {

    constructor(roomName, isHidden) {
        this.name = Room.sanitizeName(roomName);
        this.hidden = (typeof isHidden !== 'undefined' && parseInt(isHidden) === 1);
        this.users = [];
    }

    userExists(socketId) {
        return (typeof this.getUser(socketId) !== 'undefined');
    }

    addUser(user) {
        user.room = this;
        this.users.push(user);
    }

    removeUser(socketId) {
        let user = this.getUser(socketId);

        this.users = this.users.filter((deleteUser) => deleteUser.id !== socketId);

        return user;
    }

    getUser(socketId, removeFromRoom) {
        let remove = removeFromRoom || false;

        let user = _.find(this.users, (user) => user.id === socketId);

        if (remove) {
            this.removeUser(user.id);
        }

        return user;
    }

    getUsers() {
        return this.users;
    }

    hasUsers() {
        return (this.users.length > 0);
    }

    hasUser(socketId) {
        return (typeof this.getUser(socketId) !== 'undefined');
    }

    hasName(roomName) {
        let name = Room.sanitizeName(roomName);

        return (this.name === name);
    }

    static sanitizeName(roomName) {
        return roomName.toLowerCase();
    }

    static isValidRoomName(roomName) {
        return isValidString(roomName);
    }

}

module.exports = {Room};