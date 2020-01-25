import React, { Component } from 'react';
import { Form, Button } from 'react-bootstrap';
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
                <Form className='message-form'>
                    <Form.Control
                        className='message-input'
                        type="text"
                        placeholder="Enter your message"
                        onChange={this.handleTextChange}
                        value={message}
                    />
                    <Button className='message-button' onClick={this.handleSubmit}>Send message</Button>
                </Form>

            </React.Fragment>
        )
    }
}
