const path = require('path');
const express = require('express');
const http = require('http');

const {sockets} = require('./lib/sockets');
const {chatRouter} = require('./middleware/chat-router');

const publicPath = path.join(__dirname, '../public/');
const port = process.env.PORT || 3000;

let app = express();
let server = http.createServer(app);
let io = sockets(server);

app.use(express.static(publicPath));

app.get('/chat', chatRouter);

app.get('/chat/:id', (req, res) => {
    res.sendFile('chat.html', {root: publicPath});
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});