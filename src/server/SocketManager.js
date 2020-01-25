const io = require('./index').io;

const {
    VERIFY_USER,
    USER_CONNECTED,
    LOGOUT,
    DEFAULT_CHAT,
    CREATE_NEW_CHAT,
    UPDATE_CHATS,
    CREATE_NEW_CHAT_USER,
    SEND_MESSAGE,
    RECEIVE_MESSAGE,
    NEW_CHAT_CREATED,
    ADD_USER_TO_CHAT
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

        io.emit(UPDATE_CHATS, chats);
    })

    socket.on(LOGOUT, () => {
        chats = removeUserFromChats(socket);
        connectedUsers = removeUser(connectedUsers, socket.user.name);
        io.emit(UPDATE_CHATS, chats);
    })
    /*
        socket.on(DEFAULT_CHAT, (user) => {
            chats[0].users.push(user)
            io.emit(UPDATE_CHATS, chats)
        })
    */
    socket.on(DEFAULT_CHAT, (callback) => {
        let user = socket.user;
        callback(chats[0]);
        io.emit(ADD_USER_TO_CHAT, chats[0].id, user)
        chats[0].users.push(user);
    })

    socket.on(CREATE_NEW_CHAT, (chatName, user) => {
        let newChat = createChat({
            name: chatName,
            users: [user]
        });
        chats.push(newChat);
        io.emit(NEW_CHAT_CREATED, newChat, user.id);
    })

    socket.on(SEND_MESSAGE, function ({ chatId, user, message }) {
        sendMessageToChat(chatId, user, message)
    })

}

function sendMessageToChat(chatId, user, message) {

    return (chatId, user, message) => {
        io.emit(`${RECIEVE_MESSAGE}-${chatId}`, createMessage({ message, user }))
    }
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

function removeUserFromChats(socket) {
    for (let chat of chats) {
        console.log(chat)
        for (let i = 0; i < chat.users.length; i++) {
            if (chat.users[i] === socket.user) {
                chat = chat.users.pop(chat.users[i])
            }
        }
    }
    return chats
}