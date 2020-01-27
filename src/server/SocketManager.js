const io = require('./index').io;

const {
    VERIFY_USER,
    USER_CONNECTED,
    USER_DISCONNECTED,
    LOGOUT,
    DEFAULT_CHAT,
    CREATE_NEW_CHAT,
    CREATE_NEW_MESSAGE,
    NEW_CHAT_CREATED,
    ADD_USER_TO_CHAT,
    RECIEVE_MESSAGE,
    GET_CHAT,
    UPDATE_CHAT,
    SEND_CHAT
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
                isUser: true
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

        let refChatId = socket.handshake.headers.referer
            .replace(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/g, '$6')
            .replace('?chat=', '');
        console.log(`Referer chat ID: ${refChatId}`)

        for (chat of chats) {
            if (chat.id === refChatId) {
                console.log('need to send chat:', chat.name);
                /*chat.users.push(user);*/
                console.log('before sending',chat)
                socket.emit(SEND_CHAT, chat);
                console.log('need to add user:', user.name, 'to', chat.id);
                io.emit(ADD_USER_TO_CHAT, chat.id, user);

            }
        }

    })

    socket.on('disconnect', () => {

        console.log(`Socket ${socket.id} disconnected.`);
        let user = socket.user;

        chats = removeUserFromChats(user);
        io.emit(USER_DISCONNECTED, user);
        connectedUsers = removeUser(connectedUsers, user);
    })

    socket.on(LOGOUT, () => {
        let user = socket.user;

        chats = removeUserFromChats(user);
        io.emit(USER_DISCONNECTED, user);
        connectedUsers = removeUser(connectedUsers, user.name);
    })

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

    socket.on(CREATE_NEW_MESSAGE, (chatId, user, message) => {
        let newMessage = createMessage({ message: message, sender: user });
        for (let chat of chats) {
            if (chatId === chat.id) {
                chat.messages.push(newMessage);
                break;
            }
        }
        io.emit(RECIEVE_MESSAGE, chatId, newMessage);
    })

    socket.on(GET_CHAT, (chatId) => {
        for (let chat of chats) {
            if (chatId === chat.id) {
                if(!chat.users.filter(user=>socket.user.id===user.id)){
                    console.log('get chat')
                    chat.users.push(socket.user)
                }
                socket.emit(SEND_CHAT, chat)
            }
        }
    })

    socket.on(UPDATE_CHAT, (chatId) => {
        for (let chat of chats) {
            if (chatId === chat.id) {
                socket.emit(UPDATE_CHAT, chat)
            }
        }
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

function removeUserFromChats(user) {
    for (let chat of chats) {
        chat.users = chat.users.filter(chatUser => chatUser.id !== user.id)
    }
    return chats
}