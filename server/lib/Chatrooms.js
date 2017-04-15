const {EventEmitter} = require('events');
const _ = require('lodash');
const {prepString} = require("../utils/string");

let rooms = null;

class Chatrooms extends EventEmitter {

    constructor() {
        super();
        this.rooms = [];
    }

    join(socketId, userName, roomParams) {
        // Find room if exists
        let room = _.find(this.rooms, (room) => room.name === prepString(roomParams.name));

        // Create room if it doesn't exist
        if (!room) {
            room = {
                name: prepString(roomParams.name),
                isHidden: (typeof roomParams.isHidden !== 'undefined' && parseInt(roomParams.isHidden) === 1),
                users: []
            };

            // Add room
            this.rooms.push(room);
        }

        // Leave user from old room before assigning to new one
        this.leave(socketId);

        let user = {
            id: socketId,
            name: prepString(userName),
            room: room
        };

        // Add user to the room
        room.users.push(user);

        // Emit the update room list event
        this.emit('updateRoomList', this.getRoomList());

        return user;
    }

    leave(socketId) {
        // Get the user
        let user = this.getUser(socketId);

        if (user) {
            // Remove the user from the room
            user.room.users = _.filter(user.room.users, (user) => user.id !== socketId);

            // Remove room if empty
            if (user.room.users.length === 0) {
                this.rooms = _.filter(this.rooms, (room) => room.name !== user.room.name);
            }

            // Emit the update room list event
            this.emit('updateRoomList', this.getRoomList());

            // Get the user back
            return user;
        }
    }

    getUser(socketId) {
        // Find the room containing the user
        let room = _.find(this.rooms, (room) => {
            return (_.findIndex(room.users, (user) => user.id === socketId) !== -1);
        });

        // Return the user if room exists
        if (room) {
            return _.find(room.users, (user) => user.id === socketId);
        }
    }

    getUserList(roomName) {
        // Get the room
        let room = _.find(this.rooms, (room) => room.name === prepString(roomName));

        // Return empty array if room doesn't exist
        if (!room) {
            return []
        }

        // Return all user names of given room
        return _.map(room.users, (user) => user.name);
    }

    getRoomList() {
        // Find all visible rooms
        let rooms = _.filter(this.rooms, (room) => !room.isHidden);

        // Return the room names
        return _.map(rooms, (room) => room.name);
    }

}

// Create a global instance
module.exports.getInstance = () => {
    if (!rooms) {
        rooms = new Chatrooms();
    }

    return rooms;
};

// Reset instance for testing
module.exports.resetInstance = () => {
    rooms = new Chatrooms();
};