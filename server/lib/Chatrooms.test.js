const {expect} = require('chai');

const Chatrooms = require('./Chatrooms');

describe('Chatroom', () => {

    let chatrooms, chatRoom, courseRoom, userJohn, userMaria;

    beforeEach(() => {

        Chatrooms.resetInstance();
        chatrooms = Chatrooms.getInstance();

        userJohn = {id: 'user-john', name: 'john', isTyping: false};
        chatRoom = {name: 'chat', users: [userJohn], isHidden: false};

        userMaria = {id: 'user-maria', name: 'maria', isTyping: true};
        courseRoom = {name: 'course'};

        userJohn.room = chatRoom;

        chatrooms.rooms = [chatRoom];
    });

    it('should return the global instance of Chatrooms', () => {
        let instance = Chatrooms.getInstance();
        expect(instance).to.be.equal(chatrooms);
    });

    describe('join', () => {
        it('should create a new room with a new user', () => {
            expect(chatrooms.rooms).to.have.lengthOf(1);

            chatrooms.join(userMaria.id, userMaria.name, courseRoom);

            expect(chatrooms.rooms).to.have.lengthOf(2);
            expect(chatrooms.rooms[1].name).to.be.equal(courseRoom.name);
            expect(chatrooms.rooms[1].users).to.have.lengthOf(1);
            expect(chatrooms.rooms[1].users[0].id).to.be.equal(userMaria.id);
            expect(chatrooms.rooms[1].users[0].name).to.be.equal(userMaria.name);
        });

        it('should join a user to an existing room', () => {
            expect(chatrooms.rooms[0].users).to.have.lengthOf(1);

            chatrooms.join(userMaria.id, userMaria.name, chatRoom);

            expect(chatrooms.rooms[0].users).to.have.lengthOf(2);
            expect(chatrooms.rooms[0].users[1].id).to.be.equal(userMaria.id);
            expect(chatrooms.rooms[0].users[1].name).to.be.equal(userMaria.name);
        });

        it('should leave a user from a room by joining another one', () => {
            expect(chatrooms.rooms[0].users).to.have.lengthOf(1);

            chatrooms.join(userJohn.id, userJohn.name, courseRoom);

            expect(chatrooms.rooms).to.have.lengthOf(1);
            expect(chatrooms.rooms[0].users[0].id).to.be.equal(userJohn.id);
            expect(chatrooms.rooms[0].users[0].name).to.be.equal(userJohn.name);
        });
    });

    describe('leave', () => {
        it('should remove a user from a room', () => {
            chatRoom.users = [userJohn, userMaria];

            expect(chatrooms.rooms[0].users).to.have.lengthOf(2);

            chatrooms.leave(userJohn.id);

            expect(chatrooms.rooms[0].users).to.have.lengthOf(1);
        });

        it('should remove a room if all users leave', () => {
            expect(chatrooms.rooms).to.have.lengthOf(1);

            chatrooms.leave(userJohn.id);

            expect(chatrooms.rooms).to.have.lengthOf(0);
        });
    });

    describe('getUser', () => {
        it('should return a user', () => {
            chatRoom.users = [userJohn, userMaria];

            let user = chatrooms.getUser(userMaria.id);

            expect(user).to.exist;
            expect(user.id).to.be.equal(userMaria.id);
            expect(user.name).to.be.equal(userMaria.name);
        });

        it('should not return a non-existent user', () => {
            chatRoom.users = [userJohn, userMaria];

            let user = chatrooms.getUser('fake-user');

            expect(user).to.not.exist;
        });
    });

    describe('getUserList', () => {
        it('should return a user list with 2 user names', () => {
            chatRoom.users = [userJohn, userMaria];

            let list = chatrooms.getUserList(chatRoom.name);

            expect(list).to.have.lengthOf(2);
            expect(list).to.have.members([userJohn.name, userMaria.name]);
        });
    });

    describe('getTypingUsers', () => {
        it('should return a user list with 2 typing user names', () => {
            let typingUser = {id: 'user-typing', name: 'typing', isTyping: true};
            chatRoom.users = [userJohn, userMaria, typingUser];

            let list = chatrooms.getTypingUsers(chatRoom.name);

            expect(list).to.have.lengthOf(2);
            expect(list).to.have.members([typingUser.name, userMaria.name]);
        });
    });

    describe('getRoomList', () => {
        it('should return a list of 2 rooms', () => {
            chatrooms.rooms = [chatRoom, courseRoom];

            let list = chatrooms.getRoomList();

            expect(list).to.have.lengthOf(2);
            expect(list).to.have.members([chatRoom.name, courseRoom.name]);
        });

        it('should return a list of 2 rooms without containing the hidden room', () => {
            chatrooms.rooms = [chatRoom, courseRoom, {name: 'hidden', isHidden: true}];

            let list = chatrooms.getRoomList();

            expect(list).to.have.lengthOf(2);
            expect(list).to.have.members([chatRoom.name, courseRoom.name]);
        });
    });

});