import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol } from 'mdbreact';
import { DEFAULT_CHAT, NEW_CHAT_CREATED, ADD_USER_TO_CHAT, RECIEVE_MESSAGE, UPDATE_CHAT, GET_CHAT, SEND_CHAT, USER_DISCONNECTED, TYPING } from '../Events';
import './ChatContainer.css';
import SideBar from './sidebar/SideBar';
import ChatHeader from './messages/ChatHeader';
import ChatMessages from './messages/ChatMessages';
import ChatInput from './messages/ChatInput';

export default class ChatContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeChat: null,
            chats: []
        }
    }

    componentDidMount() {
        this.initSocket();
    }

    initSocket() {
        const { socket } = this.props;

        socket.emit(DEFAULT_CHAT, this.addChat);

        socket.on(NEW_CHAT_CREATED, (newChat, userId) => {
            const { user } = this.props;

            this.addChat(newChat);
            if (userId === user.id) {
                this.setState({ activeChat: newChat.id })
            }
        });

        socket.on(ADD_USER_TO_CHAT, (chatId, user) => {
            const { chats } = this.state;
            const currentUser = this.props.user;

            //If user was connected by referal link, send him chat data before adding him to chat
            if (user.id === currentUser.id) {
                console.log(chats, chats.filter(chat => chat.id === chatId))
                if (!chats.filter(chat => chat.id === chatId)) {
                    socket.emit(GET_CHAT, chatId);
                }
            }

            let newChats = chats.map(chat => {
                if (chat.id === chatId) {
                    chat.users.push(user)
                    //If current user is added to chat, set active chat (for default chat)
                    if (user.id === this.props.user.id) {
                        this.setState({ activeChat: chatId })
                    }
                }
                return chat;
            })
            this.setState({ chats: newChats })
        })

        socket.on(RECIEVE_MESSAGE, (chatId, message) => {
            this.addMesageToChat(chatId, message);
        })

        socket.on(UPDATE_CHAT, (newChat) => {

            const { chats } = this.state;

            let newChats = chats.map((chat) => {
                if (chat.id === newChat.id) {
                    chat = newChat;
                }
                return chat
            })

            this.setState({ chats: newChats })
        })

        socket.on(SEND_CHAT, (newChat) => {
            this.addChat(newChat);
            this.setActiveChat(newChat.id);
        })

        socket.on(USER_DISCONNECTED, (user) => {
            this.removeUserFromChats(user);
        });

        socket.on(TYPING, (chatId, user, isTyping) => {
            this.updateTypingUsers(chatId, user, isTyping)
        })
    }

    addChat = (chat) => {
        const { chats } = this.state;
        const newChats = [...chats, chat];

        this.setState({ chats: newChats });

    }

    addMesageToChat = (chatId, message) => {
        const { chats } = this.state;

        let newChats = chats.map((chat) => {
            if (chat.id === chatId) {
                chat.messages.push(message)
            }
            return chat;
        })

        this.setState({ chats: newChats })
    }

    setActiveChat(chatId) {
        this.setState({ activeChat: chatId })
    }

    removeUserFromChats(user) {
        const { chats } = this.state;

        let newChats = chats;
        for (let chat of newChats) {
            chat.users = chat.users.filter(chatUser => chatUser.id !== user.id)
        }
        this.setState({ chats: newChats })
    }

    sendTyping(chatId, user, isTyping) {

        const { socket } = this.props
        socket.emit(TYPING, chatId, user, isTyping)

    }

    updateTypingUsers(chatId, user, isTyping){
        if (user.name !== this.props.user.name) {

            const { chats } = this.state
            let newChats = chats.map((chat) => {
                if (chat.id === chatId) {
                    if (isTyping && !chat.typingUsers.includes(user.name))
                        chat.typingUsers.push(user.name)
                    else if (!isTyping && chat.typingUsers.includes(user.name))
                        chat.typingUsers = chat.typingUsers.filter(u => u !== user.name)
                }
                return chat;
            })
            this.setState({ chats: newChats })
        }
    }

    render() {
        const { user, logout, socket } = this.props;
        const { activeChat, chats } = this.state;

        return (
            <MDBContainer fluid className="flex-container">
                <MDBRow className='vw-100'>
                    <MDBCol className='sidebar-container z-depth-1'>
                        <SideBar
                            socket={socket}
                            logout={logout}
                            chats={chats}
                            user={user}
                            activeChat={activeChat}
                            setActiveChat={(chatId) => this.setActiveChat(chatId)} />
                    </MDBCol>
                    <MDBCol className="chat-room-container">
                        <ChatHeader />
                        <ChatMessages
                            chats={chats}
                            activeChat={activeChat}
                            user={user}
                        />
                        <ChatInput
                            socket={socket}
                            user={user}
                            activeChat={activeChat}
                            sendTyping={
                                (isTyping) => {
                                    this.sendTyping(activeChat, user, isTyping)
                                }
                            }
                        />
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        )
    }

}