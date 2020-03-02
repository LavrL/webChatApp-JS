//var io = require('socket.io');
var socket = io();
//var $ = require('jquery');

$(".room-title").text('channel - ' + room);
$(".avatar-name").text(name);

$(function () {
    var socket = io();
    $('form').submit(function () {
        socket.emit('chat message', {
            msg: $('#m').val(),
            room: room
        });
        $('#m').val('');
        return false;
    });
});

socket.on('chat message', function (msg) {
    console.log('typed message', msg);
    $('#messages').append($('<li>').text(name + ' says: ' + msg));
    // window.scrollTo(0, document.body.scrollHeight);
});

// fires when client successfully connects to the server
socket.on("connect", function () {
    console.log("Connected to Socket I/O Server!");
    console.log(name + " wants to join channel " + room);
    socket.emit('joinRoom', {    // to join a specific room
        name: name,
        room: room
    });
});

socket.on("message", function (msg) {
    console.log("new message ");
    var $messages = $("#messages");
    var $message = $('<li></li>');
    $message.append("<p>" + msg.text + "</p>");
    $messages.append($message);
})
