const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const sconf = require('./server_config');

const PORT_NUMBER = process.env.PORT || 7777;

const server = express()
  .use(cors({credentials: true, origin: '*'}))
  .use((req, res) => res.send('Hello!!'))
  .listen(PORT_NUMBER, () => console.log(`Listening on ${PORT_NUMBER}`));

const io = socketio(server);

connections=[];
width=0;
img='';
s = '';

io.on('connection', socket => {
    addToConnections(connections, socket);
    socket.emit('width_value', width);
    socket.emit('update_picture', img);

    socket.on('width_changed', val => {
        width += val;

        if(width >= 100)
           width=0;
        
        emitToAllClients(connections,'width_value',width);
        
    })

    socket.on('picture_added', pic => {
        img = pic;
        emitToAllClients(connections, 'update_picture', img);
    })

    socket.on('new_stream', streamInfo => {
        s = streamInfo;
        console.log(s);
        emitToAllClients(connections, 'stream_sent', s)
    })

    socket.on('disconnect', () => {
       removeFromConnections(connections, socket);
    });
})

function addToConnections(connections, socket){
    connections.push(socket);
    console.log('New client connected ('+connections.length+' connections).');
    emitToAllClients(connections, 'connections_changed', connections.length)
}

function removeFromConnections(connections, socket) {
    connections.splice(connections.indexOf(socket), 1);
    console.log('Disconnected: %s sockets connected.', connections.length);
    emitToAllClients(connections, 'connections_changed', connections.length)

    connections.forEach(s => {
        s.emit('connections_changed', connections.length);
    })
}

function emitToAllClients (connections, emitter, data) {
    connections.forEach(s => {
        s.emit(emitter, data);
    })
}