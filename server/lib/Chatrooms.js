const _ = require('lodash');

const {Room} = require('../models/Room');
const {User} = require('../models/User');
const {returnCaseInsensitive} = require("../utils/validation.js");

let rooms = null;

class Chatrooms {

    constructor() {
        this.rooms = [];
    }

    addUser(socketId, userName, roomName) {
        let user = new User(socketId, userName);
        let room = new Room(roomName);

        this.removeUser(socketId);
        room.addUser(user);

        this.addRoom(room);

        return this.getUser(socketId);
    }

    getUser(socketId) {
        let room = _.find(this.rooms, (room) => room.getUser(socketId)) || false;

        if (room) {
            return room.getUser(socketId);
        }
    }

    getUserList(roomName) {
        let room = this.getRoom(roomName);

        if (!room) return [];

        return room.getUserList();
    }

    removeUser(socketId) {
        let user = this.getUser(socketId);


        if (user) {

            console.log(socketId, user.room.getUserList());

            let room = user.room;
            room.removeUser(socketId);

            //if (room.isEmpty()) {
                //this.removeRoom(room.name);
            //}

            return user;
        }
    }

    addRoom(room) {
        if (this.getRoom(room.name) !== false) {
            return this.getRoom(room.name).uniteUsers(room);
        }

        this.rooms.push(room);
    }

    getRoom(roomName) {
        return _.find(this.rooms, (room) => room.name === returnCaseInsensitive(roomName)) || false;
    }

    removeRoom(roomName) {
        this.rooms = _.remove(this.rooms, (room) => room.name !== roomName);
    }

    getRoomList() {
        return _.map(this.rooms, (room) => room.name);
    }
}

module.exports.getInstance = () => {
    if (!rooms) {
        rooms = new Chatrooms();
    }

    return rooms;
};

module.exports.resetInstance = () => {
    rooms = new Chatrooms();
};