import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import TextInput from './TextInput';
import { CREATE_NEW_MESSAGE } from '../Events';

export default class ChatRoom extends Component {
    /*
    sendMessage(chatId, user, message) {
        const { socket } = this.props
        socket.emit(CREATE_NEW_MESSAGE, { chatId, user, message })
    }
    */
    render() {
        const { activeChat, user, socket } = this.props;
        return (
            <Container>
                <Row></Row>
                <Row className='TextInput'>
                    <TextInput
                        socket={socket}
                        user={user}
                        activeChat={activeChat}
                    />
                </Row>
            </Container>
        )
    }
}
