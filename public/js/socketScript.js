const socket = io();
const name = parseSubmitRequest("username") || 'Anonymous';
const room = parseSubmitRequest("room") || 'No Room Selected';

const roomTitle = document.querySelector('.room-title');
roomTitle.innerHTML = 'channel - ' + room;

const avatarName = document.querySelector('.avatar-name');
avatarName.innerHTML = name;

const userMessageStyle = [
    'font-size: 16px',
    'color: black',
    'padding-left: 10px'].join(';');

const funcSubmit = () => {
    socket.emit('chat message', {
        msg: document.getElementById('postedMessage').value,
        room: room,
        name: name
    });
    document.getElementById('postedMessage').value = '';
    location.reload();
    return false;
};

const formChat = document.getElementById('btn');
formChat.addEventListener('click', funcSubmit);

const fetchChatMessages = () => {
    fetch("/chats")
        .then(handleErrors)
        .then(json => {
            json.map(data => {
                const userMessage = document.createElement('span');
                userMessage.setAttribute('style', userMessageStyle);
                userMessage.innerHTML = data.message;

                const userSaid = document.createElement('span');
                userSaid.innerHTML = data.sender + ' says: ';

                const messages = document.getElementById('messages');
                const messagesLi = document.createElement('li');

                messagesLi.setAttribute('style', 'color: blue');
                messagesLi.appendChild(userSaid);
                messagesLi.appendChild(userMessage);
                messages.appendChild(messagesLi);

            });
            let objDiv = document.getElementById("messages");
            objDiv.scrollTop = objDiv.scrollHeight;
        })
        .catch(error => {
            console.log("Error = " + error)
        });
};

socket.on('chat message', function (msg) {
    console.log('typed message', msg.message);

    const userMessage = document.createElement('span');
    userMessage.setAttribute('style', userMessageStyle);
    userMessage.innerHTML = data.message;

    const userSaid = document.createElement('span');
    userSaid.innerHTML = data.sender + ' says: ';


    const messages = document.getElementById('messages');
    const messagesLi = document.createElement('li');
    messagesLi.setAttribute('style', 'color: blue');
    messagesLi.appendChild(userSaid);
    messagesLi.appendChild(userMessage);
    messages.appendChild(messagesLi);

    messages.animate({ scrollTop: messages.prop("scrollHeight") }, 500);
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

const main = () => {
    fetchChatMessages();
};

main();
