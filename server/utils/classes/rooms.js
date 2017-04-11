class Rooms {

    constructor() {
        this.rooms = [];
    }

    addRoom(name) {
        let room = {name, isPrivate: false, password: null};

        this.rooms.push(room);
    }

    removeRoom(name) {
    }

    getRoomsList() {
    }

    static sanitizeName(name) {
        return name.toLowerCase();
    }

}

module.exports = {Rooms};