$(document).ready(function () {
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
            window.scrollTo(0, document.body.scrollHeight);
        });
    });
})