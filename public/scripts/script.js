$(function () {
    var socket = io();
    $('form').submit(function () {
        socket.emit('chat message', $('#m').val());
        $('#m').val('');
        return false;
    });
    socket.on('chat message', function (msg) {
        console.log('typed message', msg);
        $('#messages').append($('<li>').text('nick ' + msg));
        // window.scrollTo(0, document.body.scrollHeight);
    });
});

function parseSubmitRequest(variable) {
    var query = window.location.search.substring(1);
    console.log('query ', query)
    var vars = query.split('&');
    console.log('vars ', vars);
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        console.log('pair ', pair)
        if (pair[0] == variable) {
            // return (pair[1].replace(/\+/g, ' '));
            return pair[1];
        }
    }
    return undefined;
};

var socket = io();
var name = parseSubmitRequest("name") || 'Anonymous';
var room = parseSubmitRequest("room") || 'No Room Selected';
console.log('name = ', name);

$(".room-title").text('channel - '+ room);
$(".avatar-name").text(name);

// fires when client successfully connects to the server
socket.on("connect", function () {
    console.log("Connected to Socket I/O Server!");
    console.log(name + " wants to join  " + room);
    // to join a specific room
    socket.emit('joinRoom', {
        name: name,
        room: room
    });
});
