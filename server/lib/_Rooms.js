const _ = require('lodash');

const {Room} = require("../models/_Room");
const {User} = require("../models/_User");

let rooms = null;

class Rooms {

    constructor() {
        this.rooms = [];
    }

    getUser(socketId, removeFromRoom) {
        let remove = removeFromRoom || false;

        let room = _.find(this.rooms, (room) => room.userExists(socketId));

        if (room) {
            return room.getUser(socketId, remove);
        }

    }

    userExists(socketId) {
        return (typeof this.getUser(socketId) !== 'undefined');
    }

    createOrRetrieveUser(socketId, userName) {
        if (!this.userExists(socketId)) {
            return new User(socketId, userName);
        }

        let user = this.getUser(socketId, true);
        user.name = userName;

        return user;
    }

    getRoom(roomName) {
        return _.find(this.rooms, (room) => room.hasName(roomName));
    }

    roomExists(roomName) {
        return (typeof this.getRoom(roomName) !== 'undefined');
    }

    registerUser(socketId, userName, roomName, isHidden) {
        let user = this.createOrRetrieveUser(socketId, userName);

        if (this.roomExists(roomName)) {
            let roomIndex = _.findIndex(this.rooms, (room) => room.hasName(roomName));
            this.rooms[roomIndex].addUser(user);

            return this.rooms[roomIndex];
        } else {
            let room = new Room(roomName, isHidden);
            room.addUser(user);
            this.rooms.push(room);

            return room;
        }
    }

    unregisterUser(socketId) {
        let roomIndex = _.findIndex(this.rooms, (room) => room.hasUser(socketId));

        if (roomIndex !== -1) {
            let user = this.rooms[roomIndex].removeUser(socketId);
            let room = this.rooms[roomIndex];

            if (!room.hasUsers()) {
                this.rooms = this.rooms.filter((deleteRoom) => deleteRoom !== room);
            }

            return user;
        }
    }

    getRooms() {
        let rooms = this.rooms;

        return _.map(rooms, (room) => room.name);
    }

    getUsers(roomName) {
        let room = this.getRoom(roomName);

        if (room) {
            return _.map(room.getUsers(), (user) => user.name);
        }
    }

    static allFieldsAreValid(userName, roomName) {
        return (User.isValidUserName(userName) && Room.isValidRoomName(roomName));
    }
}

module.exports.getInstance = () => {
    if (!rooms) {
        rooms = new Rooms();
    }

    return rooms;
};

module.exports.resetInstance = () => {
    rooms = new Rooms();
};

module.exports.allFieldsAreValid = Rooms.allFieldsAreValid;