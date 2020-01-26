import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { DEFAULT_CHAT, NEW_CHAT_CREATED, UPDATE_CHATS, ADD_USER_TO_CHAT, RECIEVE_MESSAGE } from '../Events';
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
        /*socket.emit(DEFAULT_CHAT, this.props.user);*/
        /*socket.on(UPDATE_CHATS, (chats, userId, chatId) => {
            console.log(chats, userId, this.props.user.id)
            this.setState({ chats: chats, activeChat: userId === this.props.user.id ? chatId : this.state.activeChat })
        })*/

        socket.on(NEW_CHAT_CREATED, (newChat, userId) => {
            this.addChat(newChat);
            if (userId === this.props.user.id) {
                this.setState({ activeChat: newChat.id })
            }
        });

        socket.on(ADD_USER_TO_CHAT, (chatId, user) => {
            const { chats } = this.state;
            let newChats = chats.map((chat) => {
                if (chat.id === chatId) {
                    chat.users.push(user)
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
    }

    addChat = (chat) => {
        const { socket } = this.props;
        const { chats } = this.state;
        const newChats = [...chats, chat];

        this.setState({ chats: newChats });

    }

    setActiveChat(chat) {
        this.setState({ activeChat: chat.id })
    }

    render() {
        const { user, logout, socket } = this.props
        const { activeChat, chats } = this.state

        return (
            <Container fluid className="flex-container">
                <Row>
                    <Col className='sidebar-container'>
                        <SideBar
                            socket={socket}
                            logout={logout}
                            chats={chats}
                            user={user}
                            activeChat={activeChat}
                            setActiveChat={(chat) => this.setActiveChat(chat)} />
                    </Col>
                    <Col className="chat-room-container">
                        <ChatRoom
                            socket={socket}
                            user={user}
                            activeChat={activeChat}
                            chats={chats}
                        />
                    </Col>
                </Row>
            </Container>
        )
    }

}