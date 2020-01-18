const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
const scnf = require('./server_config');

const PORT_NUMBER = process.env.PORT || 7777;

const server = express()
  .use(cors({credentials: true, origin: '*'}))
  .use((req, res) => res.send('Hello!!'))
  .listen(PORT_NUMBER, () => console.log(`Listening on ${PORT_NUMBER}`));

const io = socketio(server);

connections=[];

width = 0;
newWidth = 0;


io.on('connection', socket => {
    connections.push(socket);
    console.log('New client connected ('+connections.length+' connections).');
    socket.emit('connections_changed', connections.length);
    connections.forEach(s => {
       // s.emit('width_value', width);
        s.emit('connections_changed', connections.length);
    })

    let scnf_events = Object.keys(scnf.server_events);

    scnf_events.forEach(e => {  
        socket.on(e, val => {
            connections.forEach(s => {
                s.emit(scnf.server_events[e].emitter, scnf.server_events[e].callback._(val));
            })
        })
    })

    socket.emit('width_value', width);

    /*socket.on('width_changed', val => {
        width += val;

        if(width >= 100)
           width=0;
        
        connections.forEach(s => {
            s.emit('width_value', width);
        })
        
    })*/

    socket.on('disconnect', () => {
        console.log('Client disconnected')
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected.', connections.length);

        connections.forEach(s => {
            s.emit('connections_changed', connections.length);
        })
    });
})

