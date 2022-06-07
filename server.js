const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const app = express();
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const server = http.createServer(app);

const io = socketIO(server);

// setting static folder for express
app.use(express.static(path.join(__dirname, './public')));
const botName = 'RichChat Bot';
// Run when a client connects
io.on('connection', (socket) => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        // Welcome current user
        // only user joining the room sees this
        socket.emit('message', formatMessage(botName, `Welcome to ${user.room} Room`));

        // Broadcast when a user connects
        // All users in the room except the current user joining room
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} has joined the chat`));

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    })

    // Run when a client sends message to the server.
    // the server gets the message as chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);
        // the server sends the message back to the client as message
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    })

    // Run when a client disconnects
    // This will be sent to all the users still connected
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessage(botName, `${user.username} has left the chatroom`)
            );

            // Send users and room info
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            });
        }
    });
})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => {
    console.log(`Server started on port http://localhost:${PORT}`);
});