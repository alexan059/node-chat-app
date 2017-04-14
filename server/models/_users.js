const _ = require('lodash');

class Users {

    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        let user = {id, name, room};
        this.users.push(user);
    }

    removeUser(id) {
        let user = this.getUser(id);

        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }

        return user;
    }

    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }

    getUserList(roomName) {
        return this.users
            .filter((user) => user.room.getName() === roomName)
            .map((user) => user.name);
    }

    getRoomList(includeHidden) {
        let hidden = includeHidden || false;
        return _.uniq(this.users.map((user) => user.room).filter((room) => (!room.hidden || hidden)));
    }

}

module.exports = {Users};