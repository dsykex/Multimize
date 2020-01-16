const express = require('express')();
const http = require('http').Server(express);
const socketio = require('socket.io')(http);

const PORT_NUMBER = 7714;
const MSG = 'Greetings';

connections=[];

socketio.on('connection', socket => {
    connections.push(socket);
    console.log('New client connected ('+connections.length+' connections).');
    console.log(socket);
    socket.emit('port', MSG);
    
})

http.listen(PORT_NUMBER, () => {
    console.log('Listening on port: '+PORT_NUMBER+'...')
})
