class Model {
    constructor() {
    }

    handleErrors(response) {
        if (!response.ok) {
            throw Error(response.status);
        }
        return response.json();
    }

    initSocketOnRoom(room, name) {
        const socket = io();
        socket.on("connect", () => {
            console.log("Connected to Socket I/O Server!");
            console.log(name + " wants to join channel " + room);
            socket.emit('joinRoom', { name: name, room: room });
        });
    }

    initSocketOnMessages(cb) {
        //const socket = io();
        this.fetchChatMessages(cb);
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

    initSocketOnChatMessages(cb) {
        const socket = io();

        socket.on('chat message', function (msg) {
            console.log('typed message', msg.message);
            cb(msg);
        });
    };

    initSocketOnNewMessage() {
        const socket = io();
        socket.on("message", function (msg) {
            console.log("new message ");
            const messages = document.getElementById('messages');
            const message = document.createElement('li');
            message.setAttribute('style', userMessageStyle);
            message.innerHTML = '<p>' + msg.text + '</p';
            messages.appendChild(message);

            let objDiv = document.getElementById("messages");
            objDiv.scrollTop = objDiv.scrollHeight;
        })
    }

    initSocketOn() {
        const socket = io();

        socket.on('notifyTyping', data => {
            typing.innerHTML = data.name + ' ' + data.message;
            console.log(data.name + data.message)
        });

        socket.on('notifyStopTyping', () => {
            typing.innerHTML = ""
        });
    };
}

class View {
    constructor() {
        const socket = io();
        this.name = this.parseSubmitRequest("username");
        this.room = this.parseSubmitRequest('room');

        this.roomTitle = this.getQueryElement('.room-title');
        this.roomTitle.innerHTML = 'channel - ' + this.room;

        this.avatarName = this.getQueryElement('.avatar-name');
        this.avatarName.innerHTML = this.name;

        const userMessageStyle = [
            'font-size: 1rem',
            'color: black',
            'padding-left: 10px'
        ].join(';');

        this.formChat = this.getByIdElement('btn');
        this.formChat.addEventListener('click', this.funcSubmit.bind(null, this.room, this.name));

        this.messageInput = this.getByIdElement('postedMessage');
        this.messageInput.addEventListener('keypress', () => {
            socket.emit('typing', {
                name: name,
                message: ' is typing ...'
            })
        });

        this.messageInput.addEventListener('keyup', () => {
            socket.emit('stopTyping', "");
        });

        this.typing = this.getByIdElement('typing');
        this.messageInput.addEventListener('keyup', () => {
            socket.emit('stopTyping', "");
        });

    }

    funcSubmit(room) {
        const socket = io();
        console.log('room ', room);
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

    getQueryElement(selector) {
        const element = document.querySelector(selector);
        return element;
    };

    getByIdElement(selector) {
        const element = document.getElementById(selector);
        return element;
    };

    createMessage = data => {
        const userMessage = this.createElement('span');
        //userMessage.setAttribute('style', userMessageStyle);
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

        this.model.initSocketOnRoom(this.view.room, this.view.name);
        this.model.initSocketOnMessages(this.view.createMessage);
        this.model.initSocketOnChatMessages(this.view.createMessage);
        this.model.initSocketOnNewMessage();
    }
}

const app = new Controller(new Model(), new View());
