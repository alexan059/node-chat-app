const Chatrooms = require('../lib/Chatrooms.js');
const uuidV1 = require('uuid/v1');
const {isValidString} = require('../utils/validation.js');

const chatrooms = Chatrooms.getInstance();

let chatRouter = (req, res) => {

    // Do the checks
    if (!isValidString(req.query.name) || !isValidString(req.query.room)) {
        return res.redirect('/index.html?error=invalid');
    }

    if (chatrooms.userNameExists(req.query.name, req.query.room)) {
        return res.redirect('/index.html?error=user_exists');
    }

    // Do the authentication
    chatrooms.authenticate(req.query.room, req.query.password).then(() => {

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
            res.redirect('/chat/' + id);
        }).catch(() => {
            // Redirect back with error
            res.redirect('/index.html?error=cannot_join');
        });

    }).catch(() => {
        // Wrong password
        return res.redirect('/index.html?error=wrong_password');
    });

};

module.exports = {chatRouter};