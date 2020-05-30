const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const cors = require('cors');

const { addUser, getUser, removeUser, getUsersInRoom } = require("./users");

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(router);
app.use(cors);

io.on('connect', (socket) => {
  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);
    //Events for ADMIN messages for when someone leaves or joins.


    // join "Joins a user in a room" were getting the room from user(line 17) that has been destructured
    socket.join(user.room);

    socket.emit("message", {
      user: "admin",
      text: `${ user.name }, Welcome to the room ; ${ user.room }`
    });
    // broadcast sends message to EVERYONE except that specific user.
    socket.broadcast.to(user.room).emit("message", {
      user: "admin",
      text: `${ user.name }, has joined the room`
    });

    //User data in room
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room)
    });

    callback();
  });

  // Events for USER generated messages
  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);
    debugger;
    io.to(user.room).emit('message', { user: user.name, text: message });
    callback();
  });

  socket.on('disconnect', () => {
    console.log("User has Left!== socket disconnect");
  });
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));

