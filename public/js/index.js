var socket = io();

socket.on('connect', function() {
    console.log('Connected to server');

    socket.emit('createMessage', {
        from: 'Jen',
        text: 'Hey, this is Jen'
    })
});

socket.on('disconnect', function() {
    console.log('Disconnected from server')
});

socket.on('newMessage', function(message) {
    console.log(message);
});