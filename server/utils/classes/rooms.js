class Rooms {

    constructor() {
        this.rooms = [];
    }

    static sanitizeName(name) {
        return name.toLowerCase();
    }

}

module.exports = {Rooms};