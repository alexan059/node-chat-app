const {expect} = require('chai');

const {Room} = require("./Room.js");
const {User} = require("./User.js");

describe('User', () => {

    it('should assign a given room to the user', () => {

        let user = new User('user-1', 'john');
        let roomName = 'chat';

        user.assignRoom(roomName);

        expect(user.room).to.be.equal(roomName);

    });

});