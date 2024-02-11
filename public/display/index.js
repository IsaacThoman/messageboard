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

function appendMessage(msg){
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.textContent = msg;
    messagesDiv.appendChild(messageDiv);
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

socket.on('roomUpdate', (rooms) => {
    clearMessages();
    if(rooms.includes(myRoom))
        appendMessage('🐙 '+myRoom);
    else
        appendMessage('🦑 '+myRoom +' does not exist on server');
});


// 🐙 Check if the Wake Lock API is supported
if ('wakeLock' in navigator) {
    let wakeLock = null;

    const requestWakeLock = async () => {
        try {
            // 🐙 Request a screen wake lock
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Screen Wake Lock is active.');

            // 🐙 Listen for the release event
            wakeLock.addEventListener('release', () => {
                console.log('Screen Wake Lock was released');
            });
        } catch (err) {
            console.error(`${err.name}, ${err.message}`);
        }
    };

    // 🐙 Call the function to request the Wake Lock
    requestWakeLock();

} else {
    console.log('Screen Wake Lock API is not supported in this browser.');
}
