import React, { Component } from 'react';
import { MDBContainer, MDBRow, MDBCol } from 'mdbreact';
import { DEFAULT_CHAT, NEW_CHAT_CREATED, ADD_USER_TO_CHAT, RECIEVE_MESSAGE, SEND_CHAT } from '../Events';
import './ChatContainer.css';
import SideBar from './SideBar'
import ChatRoom from './ChatRoom'

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
            const { chats } = this.state;
            let newChats = chats.map((chat) => {

                if (chat.id === chatId) {
                    chat.messages.push(message)
                }
                return chat;
            })
            this.setState({ chats: newChats })
        })

        socket.on(SEND_CHAT, (newChat) => {
            const { chats } = this.state;

            let newChats = chats.map((chat) => {
                if (chat.id === newChat.id) {
                    chat = newChat;
                }
                return chat
            })

            this.setState({ chats: newChats })
        })
    }

    addChat = (chat) => {
        const { chats } = this.state;
        const newChats = [...chats, chat];

        this.setState({ chats: newChats });

    }

    setActiveChat(chatId) {
        this.setState({ activeChat: chatId })
    }

    render() {
        const { user, logout, socket } = this.props;
        const { activeChat, chats } = this.state;

        return (
            <MDBContainer fluid className="flex-container">
                <MDBRow className='vw-100'>
                    <MDBCol className='sidebar-container'>
                        <SideBar
                            socket={socket}
                            logout={logout}
                            chats={chats}
                            user={user}
                            activeChat={activeChat}
                            setActiveChat={(chatId) => this.setActiveChat(chatId)} />
                    </MDBCol>
                    <MDBCol className="chat-room-container">
                        <ChatRoom
                            socket={socket}
                            user={user}
                            activeChat={activeChat}
                            chats={chats}
                        />
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        )
    }

}