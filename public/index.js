// 🐙 Select the input field and send button elements
const inputField = document.querySelector('.send input[type="text"]');
const sendButton = document.getElementById('sendBtn');
const messagesDiv = document.querySelector('.messages');
const roomSelector = document.getElementById('roomSelector');
var socket = io();

let messages = {};


// 🐙 Add an event listener to the send button for click events
sendButton.addEventListener('click', function() {
sendButtonPressed();
});

inputField.addEventListener('keyup', function(event){
    if(event.key === 'Enter')
        sendButtonPressed();
});

function sendButtonPressed(){
    // 🐙 Retrieve the value from the input field
    let msgToSend = inputField.value.trim();
    let timestamp = new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit', hour12: true});
    msgToSend = '[' + timestamp + '] ' + msgToSend;

    // 🐙 Check if the message is not empty
    if (msgToSend) {
        socket.emit('message', {'room':roomSelector.value,'message':msgToSend});

        // 🐙 Clear the input field after sending the message
        inputField.value = '';

        // 🐙 Optional: Scroll to the bottom of the messages div

    }
}



roomSelector.addEventListener('change', function(){
//console.log();
    updateMessages()
});


function updateMessages(){
    clearMessages();
    if(!(roomSelector.value in messages))
        return;
    for(let i in messages[roomSelector.value]){
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.textContent = messages[roomSelector.value][i];
        messagesDiv.appendChild(messageDiv);
    }
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}



socket.on('message', (msg) => {
    //check if messages[msg.room] exists as an array
    if(!(msg.room in messages))
        messages[msg.room] = [];

    messages[msg.room].push(msg.message);

    updateMessages();
});

socket.on('messages', (msg) => {
    messages = msg;
    updateMessages();
});

socket.on('roomUpdate', (msg) => {
    //clear roomSelector
    while(roomSelector.firstChild)
        roomSelector.removeChild(roomSelector.firstChild);

    for(let i in msg){
        let option = document.createElement('option');
        option.value = msg[i];
        option.textContent = msg[i];
        roomSelector.appendChild(option);
    }
});


function clearMessages(){
    while(messagesDiv.firstChild){
        messagesDiv.removeChild(messagesDiv.firstChild);
    }
}