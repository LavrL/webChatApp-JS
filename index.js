const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const Chat = require("./models/chat");
const connect = require("./dbconnect");
const bodyParser = require("body-parser");
const chatRouter = require("./route/chatroute");

server.listen(3000);

app.use(bodyParser.json());
app.use("/chats", chatRouter);
app.use(express.static(__dirname + '/public'));

users = [];
connection = [];
var clientInfo = {};

io.on('connection', function (socket) {
  console.log("connected successfully");
  connection.push(socket);

  socket.on('joinRoom', function (req) {
    clientInfo[socket.id] = req;
    console.log('joined Room = ' + req.room);
    socket.join(req.room);

    socket.broadcast.to(req.room).emit("message", {
      name: "System",
      text: req.name + " has joined"
    })
  })

  socket.on('chat message', function (info) {
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
    console.log("Disconnected.");
  });

});

