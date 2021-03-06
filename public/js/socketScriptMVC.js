class Model {
    constructor() {
    }

    handleErrors(response) {
        if (!response.ok) {
            throw Error(response.status);
        }
        return response.json();
    }

    initSocketOnRoom(room, name, cb) {
        const socket = io();

        // Socket connect
        socket.on("connect", () => {
            console.log("Connected to Socket I/O Server!");
            console.log(name + " wants to join channel " + room);
            socket.emit('joinRoom', { name: name, room: room });
        });

        // Online users
        socket.on('roomData', ({ users }) => {
            const onlineList = document.getElementById('onlineList');
            onlineList.innerHTML = '';

            users.forEach((user) => {
                const onlineUser = document.createElement('li');
                onlineUser.classList.add('flex__align-center');
                onlineUser.innerHTML = '<span class="dot"></span><p>' + user.name + '</p>';
                const onlineUsers = document.getElementById('onlineList');
                onlineUsers.append(onlineUser);
            })
        });

        // Message about new connected user  
        socket.on("message", function (msg) {
            const messages = document.getElementById('messages');
            const message = document.createElement('li');

            message.classList.add('message-style');
            message.innerHTML = '<p>' + msg.text + '</p';
            messages.appendChild(message);

            let objDiv = document.getElementById("messages");
            objDiv.scrollTop = objDiv.scrollHeight;
        });

        // Posted message 
        socket.on('chat message', function (msg) {
            cb(msg);
        });

    }

    fetchChatMessages(cb) {
        fetch("/chats")
            .then(this.handleErrors)
            .then(json => {
                json.map(data => {
                    cb(data);
                });
                let objDiv = document.getElementById("messages");
                objDiv.scrollTop = objDiv.scrollHeight;
            })
            .catch(error => {
                console.log("Error = " + error)
            });
    }

}

class View {
    constructor() {
        const socket = io();
        this.name = this.parseSubmitRequest("username");
        this.room = this.parseSubmitRequest('room');

        this.roomTitle = document.querySelector('.room-title');
        this.roomTitle.innerHTML = 'channel - ' + this.room;

        this.avatarName = document.querySelector('.avatar-name');
        this.avatarName.innerHTML = this.name;

        this.formChat = document.getElementById('btn');
        this.formChat.addEventListener('click', this.funcSubmit.bind(null, this.room, this.name));

        this.messageInput = document.getElementById('postedMessage');
        this.messageInput.addEventListener('keypress', () => {
            socket.emit('typing', {
                name: this.name,
                message: ' is typing ...'
            })
        });
        this.messageInput.addEventListener('keyup', (event) => {
            event.preventDefault();
            if (event.keyCode === 13) {
                this.formChat.click();
            }
        });

        this.messageInput.addEventListener('keyup', () => {
            socket.emit('stopTyping', "");
        });

        this.typing = document.getElementById('typing');

        // Typing effect "User is typing ..." 
        socket.on('notifyTyping', function (data) {
            typing.innerHTML = data.name + ' ' + data.message;
        });

        socket.on('notifyStopTyping', () => {
            typing.innerHTML = ""
        });
        this.createElement = this.createElement.bind(this);
        this.createMessage = this.createMessage.bind(this);
    }

    funcSubmit(room, name) {
        const socket = io();
        socket.emit('chat message', {
            msg: document.getElementById('postedMessage').value,
            room: room,
            name: name
        });
        document.getElementById('postedMessage').value = '';
        location.reload();
        return false;
    };

    parseSubmitRequest(keyReq) {
        const query = window.location.search.substring(1);
        const vars = query.split('&');
        for (let i = 0; i < vars.length; i++) {
            let pair = vars[i].split('=');
            if (pair[0] == keyReq) {
                return pair[1];
            }
        }
        return (keyReq === 'username') ? 'Anonymous' : 'No Room Selected';
    }

    createElement(tag, className) {
        const element = document.createElement(tag);
        if (className) element.classList.add(className);
        return element;
    };

    createMessage(data) {
        const userMessage = this.createElement('span', 'message-style');
        //userMessage.classList.add('message-style');
        userMessage.innerHTML = data.message;

        const userSaid = this.createElement('span');
        userSaid.innerHTML = data.sender + ' says: ';

        const messages = document.getElementById('messages');
        const messagesLi = this.createElement('li');

        messagesLi.setAttribute('style', 'color: blue');
        messagesLi.appendChild(userSaid);
        messagesLi.appendChild(userMessage);
        messages.appendChild(messagesLi);
    }
}

class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        this.model.initSocketOnRoom(this.view.room, this.view.name, this.view.createMessage);
        this.model.fetchChatMessages(this.view.createMessage);
    }
}

const app = new Controller(new Model(), new View());
