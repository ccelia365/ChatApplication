/**
 * Using the name and room provided, join room. Send messages to the server and display them.
 */

let chatInputMsg = document.getElementById("chat-input-msg");
let chatMessage = document.querySelector(".chat-messages");
let roomName = document.getElementById("room-name");
let userList = document.getElementById("user-list");


//Get room and name from URL

const { room, nickname } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

socket.emit('joiningRoom', { room, nickname });

//Get room and users

socket.on('roomUsers', ({ room, users }) => {
    showRoomName(room);
    showUsers(users);
})


socket.on('message', message => {
    
    showUserMessage(message);
    chatMessage.scrollTop = chatMessage.scrollHeight;

});

chatInputMsg.addEventListener('submit', (event) => {
    event.preventDefault();
    let msg = document.getElementById("msg").value;
    socket.emit('chatInput', msg);

    event.target.elements.msg.value = '';
    event.target.elements.msg.focus();

});

// Display message 

let showUserMessage = (message) => {
    let divElement = document.createElement('div');
    divElement.className = "chat-msg";
    divElement.innerHTML = `<p class="userName"> ${message.userName} <span>${message.time}</span></p>
    <p>${message.msg}</p>`;
    chatMessage.appendChild(divElement);
}

//Sidebar info
function showRoomName(room) {
    roomName.innerText = room;
}

function showUsers(users) {
    userList.innerHTML = `
        ${users.map(user => `<li class="userList">${user.nickname}</li>`).join('')}
    `;
}