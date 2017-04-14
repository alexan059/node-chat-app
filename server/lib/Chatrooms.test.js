const {expect} = require('chai');

const {Room} = require('../models/Room');
const {User} = require('../models/User');
const Chatrooms = require('./Chatrooms');

describe('Chatroom', () => {

    let chatrooms = null;
    let roomName = null;
    let room = null;
    let userJohn = null;
    let userKate = null;

    beforeEach(() => {

        Chatrooms.resetInstance();
        chatrooms = Chatrooms.getInstance();

        roomName = 'chat';
        room = new Room(roomName);
        chatrooms.rooms.push(room);

        userJohn = new User('user-1', 'john');
        userKate = new User('user-2', 'kate');

        room.addUser(userJohn);
        room.addUser(userKate);
    });

    it('should return the global instance of Chatrooms', () => {
        let instance = Chatrooms.getInstance();
        expect(instance).to.be.equal(chatrooms);
    });

    describe('addUser', () => {

        let newRoom = null;
        let newUser = null;

        beforeEach(() => {
            newRoom = 'chatroom';
            newUser = new User('new-1', 'smith');
        });

        it('should add a new user and a new room', () => {
            let theUser = chatrooms.addUser(newUser.id, newUser.name, newRoom);
            let theRoom = chatrooms.getRoom(newRoom);

            expect(theRoom).to.exist;
            expect(theUser).to.exist;

            expect(theRoom.name).to.be.equal(newRoom);
            expect(theUser.id).to.be.equal(newUser.id);

            expect(chatrooms.rooms[1]).to.be.equal(theRoom);
            expect(theUser.room).to.be.equal(theRoom)
        });

        it('should assign a new user to an existing room', () => {
            chatrooms.addUser(newUser.id, newUser.name, roomName);

            expect(chatrooms.getUser(newUser.id)).to.exist;
            expect(chatrooms.rooms).to.have.lengthOf(1);
            expect(chatrooms.rooms[0].users).to.have.lengthOf(3);
        });

        it('should remove an existing user from a room and assign to a new one with a new name', () => {
            expect(chatrooms.rooms).to.have.lengthOf(1);
            expect(chatrooms.rooms[0].users).to.have.lengthOf(2);
            expect(chatrooms.rooms[0].getUser(userJohn.id)).to.exist;
            expect(chatrooms.rooms[0].getUser(userJohn.id).name).to.be.equal(userJohn.name);

            let newName = 'newjohn';
            chatrooms.addUser(userJohn.id, newName, newRoom);

            expect(chatrooms.rooms).to.have.lengthOf(2);
            expect(chatrooms.rooms[0].users).to.have.lengthOf(1);
            expect(chatrooms.rooms[0].getUser(userJohn.id)).to.be.false;
            expect(chatrooms.rooms[1].getUser(userJohn.id).name).to.be.equal(newName);
        });
    });

    describe('getUser', () => {
        it('should get a reference to an user', () => {
            let user = chatrooms.getUser(userJohn.id);
            let newName = 'chris';

            expect(user.name).to.be.equal(userJohn.name);
            expect(user.id).to.be.equal(userJohn.id);

            user.name = newName;

            expect(chatrooms.rooms[0].users[0].name).to.be.equal(newName);
        });
    });

    describe('removeUser', () => {
        it('should remove an user from an existing room', () => {
            expect(chatrooms.rooms[0].users).to.have.lengthOf(2);

            chatrooms.removeUser(userJohn.id);

            expect(chatrooms.rooms[0].users).to.have.lengthOf(1);
        });

        it('should not do anything by removing a non-existent user', () => {
            expect(chatrooms.rooms).to.have.lengthOf(1);
            expect(chatrooms.rooms[0].users).to.have.lengthOf(2);

            chatrooms.removeUser('fake-id');

            expect(chatrooms.rooms).to.have.lengthOf(1);
            expect(chatrooms.rooms[0].users).to.have.lengthOf(2);
        });
    });

    describe('getUserList', () => {
        it('should return a list with names of users', () => {
            let list = chatrooms.getUserList(roomName);

            expect(list).to.have.lengthOf(2);
            expect(list).to.include.members([userKate.name, userJohn.name]);
        });
    });

    describe('addRoom', () => {
        it('should add a new room', () => {
            let newRoom = new Room('chatroom');

            chatrooms.addRoom(newRoom);

            expect(chatrooms.rooms).to.have.lengthOf(2);
        });

        it('should not add an existing room', () => {
            let newRoom = new Room(roomName);

            chatrooms.addRoom(newRoom);

            expect(chatrooms.rooms).to.have.lengthOf(1);
        })
    });

    describe('getRoom', () => {
        it('should get a reference to a room', () => {
            // Get the reference
            let chatRoom = chatrooms.getRoom(roomName);
            let newName = 'chatroom';
            // Assign a new name
            chatRoom.name = newName;
            // Check if the object holder contains the same object
            expect(chatRoom).to.be.equal(chatrooms.getRoom(newName));
        });
    });

    describe('removeRoom', () => {
        it('should remove an existing room', () => {
            chatrooms.removeRoom(roomName);

            expect(chatrooms.rooms).to.have.lengthOf(0);
        });
    });

    describe('getRoomList', () => {
        it('should return a list with rooms', () => {
            let list = chatrooms.getRoomList();

            expect(list).to.have.lengthOf(1);
            expect(list).to.include.members([roomName]);
        })
    });

});