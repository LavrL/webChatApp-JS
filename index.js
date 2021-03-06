const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const Chat = require("./models/chat");
const connect = require("./dbconnect");
const bodyParser = require("body-parser");

server.listen(process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

users = [];
connection = [];
let clientInfo = {};

io.on('connection', function (socket) {
  console.log("connected successfully");
  connection.push(socket);

  socket.on('joinRoom', function (req) {
    clientInfo[socket.id] = req;
    var room = req.room;
    exports.room = room;
    const chatRouter = require("./route/chatroute");

    app.use("/chats", chatRouter);
    console.log('joined Room = ' + req.room);
    socket.join(req.room);

    const user = { id: socket.id, name: req.name, room: req.room };
    users.push(user);
    io.to(req.room).emit('roomData', { users: users });
    console.log('users = ', users);

    // const existingUser = users.find((user) => user.name === req.name);
    // if (!existingUser) {
      socket.broadcast.to(req.room).emit("message", {
        name: "System",
        text: req.name + " has joined"
      });
    // }
  })

  socket.on('typing', data => {
    socket.broadcast.emit('roomData', { users: users });
    socket.broadcast.emit('notifyTyping', {
      name: data.name,
      message: data.message
    })
  });

  socket.on('stopTyping', () => {
    socket.broadcast.emit('notifyStopTyping')
  });

  socket.on('chat message', function (info) {
    socket.broadcast.to(info.room).emit('roomData', { users: users });
    socket.broadcast.to(info.room).emit("chat message", {
      message: info.msg,
      sender: info.name
    });

    console.log('received message: ' + info.msg);

    connect.then(() => {
      console.log("connected to the server");
    });

    let chatMessage = new Chat({
      message: info.msg,
      room: info.room,
      sender: info.name
    });
    chatMessage.save();
  });

  socket.on('disconnect', function () {
    connection.splice(connection.indexOf(socket), 1);

    // Remove user
    const index = users.findIndex((user) => user.id === socket.id);
    if (index !== -1) {
      users.splice(index, 1);
      io.emit('roomData', { users: users });
      console.log(users);
    }
    console.log("Disconnected.");
  });

});

