import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import TextInput from './TextInput';
import { SEND_MESSAGE } from '../Events';

export default class ChatRoom extends Component {

    sendMessage(chatId, user, message) {
        const { socket } = this.props
        socket.emit(SEND_MESSAGE, { chatId, user, message })
    }

    render() {
        const { activeChat, user } = this.props;
        return (
            <Container>
                <Row></Row>
                <Row className='TextInput'>
                    <TextInput sendMessage={
                        (message) => {
                            this.sendMessage(activeChat, user, message)
                        }
                    } />
                </Row>
            </Container>
        )
    }
}
