const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

server.listen(3000);

app.use(express.static(__dirname + '/public'));

users = [];
connection = [];

io.sockets.on('connection', function (socket) {
  console.log("connected successfully");
  connection.push(socket);

  socket.on('chat message', function (msg) {
    io.emit('chat message', msg);
    console.log('received message: ' + msg);
  });

  socket.on('disconnect', function (data) {
    connection.splice(connection.indexOf(socket), 1);
    console.log("Disconnected.");
  });

  socket.on('send mess', function (data) {
    io.sockets.emit('add mess', { mess: data.mess, name: data.name, className: data.className });
  });
});

