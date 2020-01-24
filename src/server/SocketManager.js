const io = require('./index').io;

const {
    VERIFY_USER,
    USER_CONNECTED,
    LOGOUT,
    DEFAULT_CHAT,
    NEW_CHAT,
    NEW_CHAT_USER
} = require('../Events');

const {
    createUser,
    createMessage,
    createChat
} = require('../Classes');

let defaultChat = createChat();

let chats = [defaultChat];

let connectedUsers = {};

module.exports = function (socket) {
    console.log(`Socket ID: ${socket.id}`);

    socket.on(VERIFY_USER, (username, callback) => {
        if (isUser(connectedUsers, username)) {
            callback({
                isUser: true,
                user: null
            })
        } else {
            callback({
                isUser: false,
                user: createUser({
                    name: username
                })
            })
        }
    })

    socket.on(USER_CONNECTED, (user) => {
        connectedUsers = addUser(connectedUsers, user);
        socket.user = user;

        io.emit(USER_CONNECTED, connectedUsers);
        console.log(connectedUsers)
    })

    socket.on(LOGOUT, () => {
        connectedUsers = removeUser(connectedUsers, socket.user.name)
    })

    socket.on(DEFAULT_CHAT, (callback) => {
        callback(defaultChat)
    })

    socket.on(NEW_CHAT, (chatName) => {
        let chat = createChat({name: chatName});
        chats.push(chat);
        console.log(chats);
    })
}

function isUser(userList, username) {
    return username in userList
}

function addUser(userList, user) {
    let newList = Object.assign({}, userList);
    newList[user.name] = user;
    return newList
}

function removeUser(userList, username) {
    let newList = Object.assign({}, userList);
    delete newList[username];
    return newList
}