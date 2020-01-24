import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { DEFAULT_CHAT, NEW_CHAT } from '../Events';
import './ChatContainer.css';
import SideBar from './SideBar'

export default class ChatContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeChat: null,
            chats: []
        }
    }

    componentDidMount() {
        const { socket } = this.props;
        socket.emit(DEFAULT_CHAT, this.resetChat);
        this.initSocket();
    }

    initSocket() {
        const { socket } = this.props;
        socket.on('connect', () => {
            socket.emit(DEFAULT_CHAT, this.resetChat);
        })
    }

    resetChat = (chat) => {
        return this.addChat(chat, true);
    }

    addChat(chat, reset = false) {
        const { socket } = this.props;
        const { chats } = this.state;
        const newChats = reset ? [chat] : [...chats, chat];

        this.setState({ chats: newChats, activeChat: reset ? chat : this.state.activeChat });

    }

    newChat = ( chatName ) => {
        const { socket } = this.props;
        chatName = '123'
        socket.emit(NEW_CHAT, chatName);
    }

    setActiveChat(chat) {
        this.setState({ activeChat: chat })
    }

    render() {
        const { user, logout } = this.props
        const { activeChat, chats } = this.state

        return (
            <Container fluid className='chatContainer'>
                <Row className='h-100'>
                    <Col className='sidebar bg-primary' sm='5' md='4' lg='3'>
                        <SideBar
                            logout={logout}
                            chats={chats}
                            user={user}
                            activeChat={activeChat}
                            setActiveChat={(chat) => this.setActiveChat(chat)} />
                    </Col>
                    <Col className='chat-room bg-light' sm='7' md='8' lg='9'>
                        'chat-room'
                        <Button onClick={this.newChat}>Create chat</Button>
                    </Col>
                </Row>
            </Container>
        )
    }

}