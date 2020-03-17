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

const formChat = document.getElementById('btn');
formChat.addEventListener('click', funcSubmit);

const messageInput = document.getElementById('postedMessage');
const typing = document.getElementById('typing');

messageInput.addEventListener('keypress', () => {
    socket.emit('typing', {
        name: name,
        message: ' is typing ...'
    })
});
socket.on('notifyTyping', data => {
    typing.innerHTML = data.name + ' ' + data.message;
    console.log(data.name + data.message)
});

messageInput.addEventListener('keyup', () => {
    socket.emit('stopTyping', "");
});

socket.on('notifyStopTyping', () => {
    typing.innerHTML = ""
});


const createMessage = (data) => {
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

};

socket.on('chat message', function (msg) {
    console.log('typed message', msg.message);
    createMessage(msg);
});

socket.on("message", function (msg) {
    console.log("new message ");
    const messages = document.getElementById('messages');
    const message = document.createElement('li');
    message.setAttribute('style', userMessageStyle);
    message.innerHTML ='<p>' +  msg.text + '</p';
    messages.appendChild(message);

    let objDiv = document.getElementById("messages");
    objDiv.scrollTop = objDiv.scrollHeight;
})

// fires when client successfully connects to the server
socket.on("connect", function () {
    console.log("Connected to Socket I/O Server!");
    console.log(name + " wants to join channel " + room);
    socket.emit('joinRoom', new MessageItem(name, room));
});

class MessageItem {
    constructor(name, room) {
        this.name = name;
        this.room = room;
    }
}

class App {
    static fetchChatMessages() {
        fetch("/chats")
            .then(handleErrors)
            .then(json => {
                json.map(data => {
                    createMessage(data);
                });
                let objDiv = document.getElementById("messages");
                objDiv.scrollTop = objDiv.scrollHeight;
            })
            .catch(error => {
                console.log("Error = " + error)
            });
    }
};

App.fetchChatMessages()
