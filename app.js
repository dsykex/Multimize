const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const PORT_NUMBER = process.env.PORT || 7777;

const server = express()
  .use(cors({credentials: true, origin: '*'}))
  .use((req, res) => res.send('Hello!!'))
  .listen(PORT_NUMBER, () => console.log(`Listening on ${PORT_NUMBER}`));

const io = socketio(server);

connections=[];

width = 0;

io.on('connection', socket => {
    connections.push(socket);
    console.log('New client connected ('+connections.length+' connections).');

    socket.emit('con_msg', 'Welcome to greatss.. <3');

    socket.on('width_changed', val => {
        let newWidth = width += val;
        socket.emit('width_value', newWidth);
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected')
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected.', connections.length);
    });
})

