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
    SEND_CHAT,
    TYPING
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

    /*
    * User verification.
    * If username is not taken, create new user.
    */
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

    /*
    * Handle user connection
    */
    socket.on(USER_CONNECTED, (user) => {
        connectedUsers = addUser(connectedUsers, user);
        socket.user = user;

        /*
        * If user used referal link to enter chat, send him chat data like messages and so on.
        * Then him add to chat for all users.
        */
        let refChatId = socket.handshake.headers.referer
            .replace(/^(([^:/?#]+):)?(\/\/([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/g, '$5').replace('/', '')
        console.log(`Referer chat ID: ${refChatId}`)

        doSomethingWithChat(chats, refChatId, function (chat) {
            socket.emit(SEND_CHAT, chat);
            io.emit(ADD_USER_TO_CHAT, chat.id, user);
        })
    })

    /*
    * Handle user disconnect
    */
    socket.on('disconnect', () => {
        let user = socket.user;

        if (!!user) {
            console.log(`Socket ${socket.id} disconnected.`);
            chats = removeUserFromChats(user);
            io.emit(USER_DISCONNECTED, user);
            connectedUsers = removeUser(connectedUsers, user);
        }
    })

    /*
    * Handle user logout
    */
    socket.on(LOGOUT, () => {
        let user = socket.user;

        chats = removeUserFromChats(user);
        io.emit(USER_DISCONNECTED, user);
        connectedUsers = removeUser(connectedUsers, user.name);
    })


    /*
    * Add user to default chat
    */
    socket.on(DEFAULT_CHAT, (callback) => {
        let user = socket.user;

        callback(chats[0]);
        io.emit(ADD_USER_TO_CHAT, chats[0].id, user)
        chats[0].users.push(user);
    })

    /*
    * Send new chat data
    */
    socket.on(CREATE_NEW_CHAT, (chatName, user) => {
        let newChat = createChat({
            name: chatName,
            users: [user]
        });

        chats.push(newChat);
        io.emit(NEW_CHAT_CREATED, newChat, user.id);
    })

    /*
    * Send new message to users
    */
    socket.on(CREATE_NEW_MESSAGE, (chatId, user, message) => {
        let newMessage = createMessage({ message: message, sender: user });

        doSomethingWithChat(chats, chatId, function (chat) {
            chat.messages.push(newMessage);
        })

        io.emit(RECIEVE_MESSAGE, chatId, newMessage);
    })

    /*
    * Send chat to user joined by referal link
    */
    socket.on(GET_CHAT, (chatId) => {
        doSomethingWithChat(chats, chatId, function (chat) {
            chat.users.push(socket.user)
            socket.emit(SEND_CHAT, chat)
        })
    })

    /*
    * Update typing users information
    */
    socket.on(TYPING, (chatId, user, isTyping) => {
        io.emit(TYPING, chatId, user, isTyping)
    })
}

/*
* Check is user in user list
*/
function isUser(userList, username) {
    return username in userList
}

/*
* Add user to user list
*/
function addUser(userList, user) {
    let newList = Object.assign({}, userList);
    newList[user.name] = user;
    return newList
}

/*
* Remove user from user list
*/
function removeUser(userList, username) {
    let newList = Object.assign({}, userList);
    delete newList[username];
    return newList
}

/*
* Remove user from all chats
*/
function removeUserFromChats(user) {
    for (let chat of chats) {
        chat.users = chat.users.filter(chatUser => chatUser.id !== user.id)
    }
    return chats
}

function doSomethingWithChat(chats, chatId, callback) {
    for (chat of chats) {
        if (chat.id === chatId) {
            let newChat = callback(chat)
            return newChat
        }
    }
}