var socket = io();
var name = parseSubmitRequest("name") || 'Anonymous';
var room = parseSubmitRequest("room") || 'No Room Selected';

$(function () {
    var socket = io();
    $('form').submit(function () {
        socket.emit('chat message', { msg: $('#m').val(), room: room });
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function (msg) {
        console.log('typed message', msg);
        $('#messages').append($('<li>').text(name + ' says: ' + msg));
    });
});

socket.on('chat message', function (msg) {
    console.log('typed message', msg);
    $('#messages').append($('<li>').text(name + ' says: ' + msg));
    // window.scrollTo(0, document.body.scrollHeight);
});

function parseSubmitRequest(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return undefined;
};


$(".room-title").text('channel - ' + room);
$(".avatar-name").text(name);

// fires when client successfully connects to the server
socket.on("connect", function () {
    console.log("Connected to Socket I/O Server!");
    console.log(name + " wants to join channel" + room);
    // to join a specific room
    socket.emit('joinRoom', {
        name: name,
        room: room
    });
});

