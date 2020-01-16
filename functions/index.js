const functions = require('firebase-functions');
const express = require('express');
var exp = express();

const http = require('http');
var server = http.createServer(exp);

const socketio = require('socket.io')(server);
const cors = require('cors');

exp.use(cors({credentials: true, origin: '*'}));

exp.get('/tester', (request, response) => {

    socketio.on('connection', socket => {
        connections.push(socket);
        console.log('New client connected ('+connections.length+' connections).');
        //console.log(socket);
        socket.emit('port', 'LIVE SHIT');
        response.send('Hello!');
    });
})

exports.app = functions.https.onRequest(exp)