const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {

    let users;

    beforeEach(() => {
        users = new Users();
        users.users = [{
            id: '1',
            name: 'Mike',
            room: 'office'
        },
            {
                id: '2',
                name: 'Jen',
                room: 'course'
            },
            {
                id: '3',
                name: 'Bill',
                room: 'course'
            }];
    });

    it('should add new user', () => {

        let user = {
            id: '4',
            name: 'John',
            room: 'office'
        };

        users.addUser(user.id, user.name, user.room);

        expect(users.users).toInclude(user);
    });

    it('should remove user', () => {
        let userId = '1';
        let user = users.removeUser(userId);

        expect(user.id).toBe(userId);
        expect(users.users.length).toBe(2);
    });

    it('should not remove user', () => {
        let userId = '5';
        let user = users.removeUser(userId);

        expect(user).toNotExist();
        expect(users.users.length).toBe(3);
    });

    it('should find user', () => {
        let userId = '1';
        let user = users.getUser(userId);

        expect(user.id).toBe(userId);
    });

    it('should not find user', () => {
        let userId = '5';
        let user = users.getUser(userId);

        expect(user).toNotExist();
    });

    it('should return name for course', () => {
        let userList = users.getUserList('course');

        expect(userList).toEqual(['Jen', 'Bill']);
    });

    it('should return name for office', () => {
        let userList = users.getUserList('office');

        expect(userList).toEqual(['Mike']);
    });

    it('should return all connected rooms without duplicates', () => {
        let user = {
            id: '4',
            name: 'John',
            room: 'course'
        };

        users.addUser(user.id, user.name, user.room);

        let roomList = users.getRoomList();

        expect(roomList).toInclude('office');
        expect(roomList).toInclude('course');
        expect(roomList.length).toBe(2);
    });

});