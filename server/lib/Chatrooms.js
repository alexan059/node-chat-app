const _ = require('lodash');

let rooms = null;

class Chatrooms {

    constructor() {
        this.rooms = [];
    }

    join(socketId, userName, roomParams) {
        let room = {
            name: roomParams.name,
            isHidden: (typeof roomParams.isHidden !== 'undefined' && parseInt(roomParams.isHidden) === 1),
            users: []
        };

        let user = {
            id: socketId,
            name: userName,
            room: room
        };

        room.users.push(user);
        this.rooms.push(room);

        return user;
    }

    leave(socketId) {
        let room = _.find(this.rooms, (room) => {
            return (_.findIndex(room.users, (user) => user.id === socketId) !== -1);
        });

        room.users = _.filter(room.users, (user) => user.id !== socketId);
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