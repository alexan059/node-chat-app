// const {expect} = require('chai');
//
// const {User} = require('../models/User');
// const {Room} = require('../models/Room');
// const Rooms = require('./Rooms');
//
// describe('Rooms', () => {
//
//     let rooms, john, cindy, office, course;
//
//     beforeEach(() => {
//         Rooms.resetInstance();
//         rooms = Rooms.getInstance();
//
//         john = new User('user-1', 'john');
//
//         cindy = new User('user-2', 'cindy');
//
//         office = new Room('office');
//
//         course = new Room('course');
//
//         rooms.registerUser(john.id, john.name, office.name);
//     });
//
//     it('should return the static instance of Rooms', () => {
//         let instance = Rooms.getInstance();
//
//         expect(instance).to.be.equal(rooms);
//     });
//
//     it('should register a new user to a new room', () => {
//         rooms.registerUser(cindy.id, cindy.name, course.name);
//
//         expect(rooms.rooms.length).to.be.equal(2);
//         expect(rooms.getUsers(course.name)).to.include(cindy.name);
//         expect(rooms.getUser(cindy.id).room.name).to.be.equal(course.name);
//     });
//
//     it('should register a new user to an existing room', () => {
//         rooms.registerUser(cindy.id, cindy.name, office.name);
//
//         expect(rooms.rooms.length).to.be.equal(1);
//         expect(rooms.getRoom(office.name).getUsers().length).to.be.equal(2);
//         expect(rooms.getUsers(office.name)).to.include(john.name);
//         expect(rooms.getUser(john.id).room.name).to.be.equal(office.name);
//     });
//
//     it('should remove a user from a room with other users', () => {
//         rooms.registerUser(cindy.id, cindy.name, office.name);
//         rooms.unregisterUser(cindy.id);
//
//         expect(rooms.rooms.length).to.be.equal(1);
//         expect(rooms.getRoom(office.name).getUsers().length).to.be.equal(1);
//         expect(rooms.getUsers(office.name)).to.not.include(cindy.name);
//     });
//
//     it('should remove a user from an empty room and remove the room', () => {
//         rooms.unregisterUser(john.id);
//
//         expect(rooms.rooms.length).to.be.equal(0);
//     });
//
//     it('should not do anything if the id doesn\'t exist', () => {
//         rooms.unregisterUser('user-3');
//
//         expect(rooms.rooms.length).to.be.equal(1);
//         expect(rooms.getRoom(office.name).getUsers().length).to.be.equal(1);
//         expect(rooms.getUsers(office.name)).to.include(john.name);
//     });
// });