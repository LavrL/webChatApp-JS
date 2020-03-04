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
            room: room,
            name: name
        });
        $('#m').val('');
        return false;
    });
});

(function () {
    fetch("http://localhost:3000/chats")
        .then(data => {
            //console.log(data.json());
            return data.json();
        })
        .then(json => {
            json.map(data => {
                let userMessageStyle = [
                    'font-size: 16px',
                    'color: black',
                    'padding-left: 10px'
                ].join(';');
                var userMessage = $('<span />').attr('style',userMessageStyle)
                                               .html(data.message);
                var userSaid = $('<span />').html(data.sender + ' says: ');
                $('#messages').append($('<li>')
                              .css("color", "blue")
                              .append(userSaid)
                              .append(userMessage));
            });
        });
})();

socket.on('chat message', function (msg) {
    console.log('typed message', msg.msg);
    let userMessageStyle = [
        'font-size: 16px',
        'color: black',
        'padding-left: 10px'
    ].join(';');

    var userMessage = $('<span />').attr('style', userMessageStyle)
                                    .html(msg.message);
    var userSaid = $('<span />').html(msg.sender + ' says: ');
    $('#messages').append($('<li>')
                  .css("color", "blue")
                  .append(userSaid)
                  .append(userMessage));
    $('#messages').animate({ scrollTop: $('#messages').prop("scrollHeight") }, 500);
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
