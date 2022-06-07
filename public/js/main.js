const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

// Getting Username And Room From The query String or URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

const socket = io();
// once the connection is on I am getting the message from the server.

// join Chatroom
socket.emit('joinRoom', { username, room });

// Get room and Users 

socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
    // console.log(room);
    // console.log(users);
});

socket.on('message', res => {
    console.log(res);
    // Here I am calling the function output Message that will work on the message and display it on the dom
    outputMessage(res);

    // I want us to scroll down to the bottom of the chat each time a new message is sent.
    chatMessages.scrollTop = chatMessages.scrollHeight;
})

// when a user send a message
chatForm.addEventListener('submit', e => {
    e.preventDefault();

    // get the message
    const msg = e.target.elements.msg.value;

    // emit the message to the server
    socket.emit('chatMessage', msg);

    // clear the input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

outputMessage = (message) => {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta"> ${message.username}<span> ${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}
// Add Room Name To Dom 
function outputRoomName(room) {
    roomName.innerText = room;
}
// add the list of users to a particular room
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}