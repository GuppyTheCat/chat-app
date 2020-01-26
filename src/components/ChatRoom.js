import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import TextInput from './TextInput';
import { CREATE_NEW_MESSAGE } from '../Events';
import './ChatRoom.css';
import ChatMessages from './ChatMessages';

export default class ChatRoom extends Component {

    constructor(props) {
        super(props)

        this.state = {

        }
    }

    /*
    sendMessage(chatId, user, message) {
        const { socket } = this.props
        socket.emit(CREATE_NEW_MESSAGE, { chatId, user, message })
    }
    */

    render() {
        const { activeChat, user, socket, chats } = this.props;

        return (
            <div className="chat-room">
                <ChatMessages
                    chats={chats}
                    activeChat={activeChat}
                    user={user}
                />
                <TextInput
                    socket={socket}
                    user={user}
                    activeChat={activeChat}
                />
            </div>
        )
    }
}
