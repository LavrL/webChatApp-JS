const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

server.listen(process.env.PORT || 3000);

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
    // io.emit('chat message', msg);
    socket.broadcast.to(info.room).emit("chat message", info.msg)
    console.log('received message: ' + info.msg);
  });

  socket.on('disconnect', function (data) {
    connection.splice(connection.indexOf(socket), 1);
    console.log("Disconnected.");
  });

});

