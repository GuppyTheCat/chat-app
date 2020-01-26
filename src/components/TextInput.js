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

    sendMessage = () => {
        const { activeChat, user, socket } = this.props;
        const { message } = this.state;
        socket.emit(CREATE_NEW_MESSAGE, activeChat, user, message)
    }

    render() {
        const { message } = this.state
        return (
            <React.Fragment>
                <div className='text-form'>
                    <FormControl
                        type="text"
                        placeholder="Enter your message"
                        onChange={this.handleTextChange}
                        value={message}
                        className='text-input'
                    />
                    <Button
                        onClick={this.handleSubmit}
                        className='text-button'
                        >
                        Send
                    </Button>
                </div>
            </React.Fragment>
        )
    }
}
