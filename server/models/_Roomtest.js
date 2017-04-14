const {expect} = require('chai');

const {User} = require("./_User.js");
const {Room} = require("./_Room.js");


describe('Room', () => {

    let room = null;
    let userJohn = null;
    let userKate = null;

    beforeEach(() => {
        room = new Room('chat');

        userJohn = new User('user-1', 'john');
        userKate = new User('user-2', 'kate');

        room.users[0] = userJohn;
        room.users[1] = userKate;
    });

    describe('addUser', () => {
        it('should add a user to a room', () => {
            let socketId = 'user-3';
            let userName = 'mary';
            let user = new User(socketId, userName);

            room.addUser(user);

            expect(room.users).to.have.lengthOf(3);
            expect(room.users[2].id).to.be.equal(socketId);
            expect(room.users[2].name).to.be.equal(userName);
            expect(room.users[2].room).to.be.equal(room);
        });
    });

    describe('getUser', () => {
        it('should get an existing user from room', () => {
            let user = room.getUser(userJohn.id);

            expect(user).to.be.equal(userJohn);
        });

        it('should return false if the user doesn\' exist', () => {
            let user = room.getUser('fake-id');

            expect(user).to.be.false;
        });
    });

    describe('removeUser', () => {
        it('should remove an existing user from room', () => {
            expect(room.users).to.have.lengthOf(2);

            room.removeUser(userJohn.id);

            expect(room.users).to.have.lengthOf(1);
            expect(room.users).to.not.contain(userJohn);
            expect(room.users).to.contain(userKate);
        });
    });

    describe('uniteUsers', () => {
        it('should unite users from different rooms', () => {
            let newRoom = new Room('newroom');
            let userBill = new User('new-1', 'bill');
            let userLarry = new User('new-2', 'larry');

            newRoom.addUser(userBill);
            newRoom.addUser(userLarry);

            expect(newRoom.users).to.have.lengthOf(2);

            room.uniteUsers(newRoom);

            expect(room.users).to.have.lengthOf(4);
        });
    });

    describe('isEmpty', () => {
       it('should return empty when all users left', () => {
           expect(room.isEmpty()).to.be.false;

            room.removeUser(userJohn.id);

            expect(room.isEmpty()).to.be.false;

            room.removeUser(userKate.id);

            expect(room.isEmpty()).to.be.true;
       })
    });

    describe('getUserList', () => {
        it('should return a list with names of users', () => {
            let list = room.getUserList();

            expect(list).to.have.lengthOf(2);
            expect(list).to.include.members([userKate.name, userJohn.name]);
        });

        it('should return an empty list', () => {
            room.removeUser(userKate.id);
            room.removeUser(userJohn.id);

            let list = room.getUserList();

            expect(list).to.be.a('array');
            expect(list).to.have.lengthOf(0);
        });
    });
});