var socket = io();
const messagesDiv = document.querySelector('.messages');
let messages = {};
const params = new URLSearchParams(window.location.search);
const myRoom = params.get('room');



function clearMessages(){
    while(messagesDiv.firstChild){
        messagesDiv.removeChild(messagesDiv.firstChild);
    }
}

function updateMessages(){
    clearMessages();
    if(!(myRoom in messages))
        return;
    for(let i in messages[myRoom]){
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.textContent = messages[myRoom][i];
        messagesDiv.appendChild(messageDiv);
    }
scrollToBottom()
}

function scrollToBottom(){
    //scroll to bottom of entire screen
    window.scrollTo(0,document.body.scrollHeight);
}

socket.on('message', (msg) => {
    //check if messages[msg.room] exists as an array
    if(!(msg.room in messages))
        messages[msg.room] = [];

    messages[msg.room].push(msg.message);

    updateMessages();
    while(messages[msg.room].length>=5)
        messages[msg.room].shift();

});