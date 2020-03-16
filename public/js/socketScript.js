const socket = io();
var name = parseSubmitRequest("username") || 'Anonymous';
var room = parseSubmitRequest("room") || 'No Room Selected';

const roomTitle = document.querySelector('.room-title');
roomTitle.innerHTML = 'channel - ' + room;
//$(".room-title").text('channel - ' + room);
//$(".avatar-name").text(name);
const avatarName = document.querySelector('.avatar-name');
avatarName.innerHTML = name;

// $(document).ready(function () {
//     var socket = io();
//     $('form').submit(function () {
//         socket.emit('chat message', {
//             msg: $('#m').val(),
//             room: room,
//             name: name
//         });
//         $('#m').val('');
//         return false;
//     })
// });
const formChat = document.getElementById('btn');
console.log(formChat);
formChat.addEventListener('click', funcSubmit);

function funcSubmit() {
    //event.preventDefault();
    socket.emit('chat message', {
        msg: $('#m').val(),
        room: room,
        name: name
    });
    $('#m').val('');
    location.reload();
    return false;
};


$(document).ready(function () {
    fetch("/chats")
        .then(handleErrors)
        .then(json => {
            // console.log(json)
            json.map(data => {
                let userMessageStyle = [
                    'font-size: 16px',
                    'color: black',
                    'padding-left: 10px'
                ].join(';');
                var userMessage = $('<span />').attr('style', userMessageStyle)
                    .html(data.message);
                var userSaid = $('<span />').html(data.sender + ' says: ');
                $('#messages').append($('<li>')
                    .css("color", "blue")
                    .append(userSaid)
                    .append(userMessage));
            });
            let objDiv = document.getElementById("messages");
            objDiv.scrollTop = objDiv.scrollHeight;
        })
        .catch(error => {
            console.log("Error = " + error)
        });
});

socket.on('chat message', function (msg) {
    console.log('typed message', msg.message);
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
    socket.emit('joinRoom', {
        name: name,
        room: room
    });
});

// socket.on("message", function (msg) {
//     console.log("new message ");
//     var $messages = $("#messages");
//     var $message = $('<li></li>');
//     $message.append("<p>" + msg.text + "</p>");
//     $messages.append($message);
// })
