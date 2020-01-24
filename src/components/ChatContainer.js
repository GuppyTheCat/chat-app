import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { DEFAULT_CHAT, NEW_CHAT, UPDATE_CHATS } from '../Events';
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

        socket.emit(DEFAULT_CHAT, this.props.user);
        socket.on(UPDATE_CHATS, (chats, userId, chatId) => {
            console.log(chats, userId, this.props.user.id)
            this.setState({ chats: chats, activeChat: userId === this.props.user.id ? chatId : this.state.activeChat })
        })
    }

    addChat = (chat) => {
        const { socket } = this.props;
        const { chats } = this.state;
        const newChats = [...chats, chat];

        this.setState({ chats: newChats, activeChat: chat.id });

    }

    setActiveChat(chat) {
        this.setState({ activeChat: chat.id })
    }

    render() {
        const { user, logout, socket } = this.props
        const { activeChat, chats } = this.state

        return (
            <Container fluid className='chatContainer'>
                <Row className='h-100'>
                    <Col className='sidebar' sm='5' md='4' lg='3'>
                        <SideBar
                            socket={socket}
                            logout={logout}
                            chats={chats}
                            user={user}
                            activeChat={activeChat}
                            setActiveChat={(chat) => this.setActiveChat(chat)} />
                    </Col>
                    <Col className='chat-room bg-light' sm='7' md='8' lg='9'>
                        <ChatRoom
                            socket={socket}
                            user={user}
                            activeChat={activeChat}
                        />
                    </Col>
                </Row>
            </Container>
        )
    }

}