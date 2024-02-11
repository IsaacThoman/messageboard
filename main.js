const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const messages = {};

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.emit('roomUpdate', ['Mill A','Mill B','Mill C','Mill D','Mill E','Mill F']);


    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('message', (msg) => {
        io.emit('message', msg);
    });


});

server.listen(3000, () => {
    console.log('listening on *:3000');
});