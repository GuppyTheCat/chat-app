import React, { Component } from 'react';
import { FormControl, Button, Col } from 'react-bootstrap';
import { CREATE_NEW_MESSAGE } from '../Events';
import './TextInput.css';

export default class TextInput extends Component {
    constructor(props) {
        super(props);
        this.state = { message: "", isTyping: false };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.sendMessage();
        this.setState({ message: "" });
    }

    handleTextChange = (e) => {
        this.setState({ message: e.target.value })
    }
    /*
    sendMessage = () => {
        const { activeChat, user } = this.props;
        const { message } = this.state;
        this.props.sendMessage(activeChat, user, message)
    }
    */
    sendMessage = () => {
        console.log('submit message')
        const { activeChat, user, socket } = this.props;
        const { message } = this.state;
        socket.emit(CREATE_NEW_MESSAGE, activeChat, user, message)
    }

    render() {
        const { message } = this.state
        return (
            <React.Fragment>
                <Col className='message-input col-8 col-lg-9'>
                    <FormControl
                        type="text"
                        placeholder="Enter your message"
                        onChange={this.handleTextChange}
                        value={message}
                    />
                </Col>
                <Col className='message-button col-4 col-lg-3'>
                    <Button  onClick={this.handleSubmit}>Send message</Button>
                </Col>
            </React.Fragment>
        )
    }
}
