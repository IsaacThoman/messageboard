const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const roomNames = ['Mill A','Mill B','Mill C','Mill D','Mill E','Mill F'];

const messages = {};

for(let i in roomNames)
    messages[roomNames[i]] = ["🐙 Connected to "+roomNames[i]+""];

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.emit('roomUpdate', roomNames);

    socket.emit('messages', messages);


    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('message', (msg) => {
        if((roomNames.indexOf(msg.room) === -1))
            return;

        if(!(msg.room in messages))
            messages[msg.room] = [];

        messages[msg.room].push(msg.message);
        cleanMessages();

        io.emit('message', msg);
    });



});

function cleanMessages(){
   // for(let room in messages)
   //     while(messages[room].length > 8)
   //         messages[room] = messages[room].shift(1);


}

server.listen(3000, () => {
    console.log('listening on *:3000');
});