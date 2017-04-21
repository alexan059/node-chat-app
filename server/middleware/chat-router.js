const Chatrooms = require('../lib/Chatrooms.js');
const uuidV1 = require('uuid/v1');
const {isValidString} = require('../utils/validation.js');
const bcrypt = require('bcryptjs');

const chatrooms = Chatrooms.getInstance();

let chatRouter = (req, res) => {

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash('password', salt, (err, hash) => {
            if (err) {
                return reject(err);
            }
            console.log(hash);
        });
    });

    // Do the checks
    if (!isValidString(req.query.name) || !isValidString(req.query.room)) {
        return res.redirect('/index.html?error=invalid');
        //return callback({error: 'Name and room are not valid.'});
    }

    if (chatrooms.userNameExists(req.query.name, req.query.room)) {
        return res.redirect('/index.html?error=user_exists');
        //return callback({error: 'User already exists in this room.'});
    }

    // Do the authentication
    chatrooms.authenticate(req.query.room, req.query.password).catch(() => {
        return res.redirect('/index.html?error=wrong_password');
    });

    // Create a unique ID
    let id = uuidV1();
    let room = {
        name: req.query.room,
        isHidden: req.query.hidden,
        password: req.query.password
    };

    // Find or create room and join user
    chatrooms.register(id, req.query.name, room).then(() => {
        // Redirect forward

        res.send('Hello World!');
    }).catch(() => {
        // Redirect back with error
        res.redirect('/index.html?error=cannot_join');
    });

};

module.exports = {chatRouter};