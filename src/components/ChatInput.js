import React, { Component } from 'react';
import { MDBInput, MDBBtn } from 'mdbreact';
import { CREATE_NEW_MESSAGE } from '../Events';
import './ChatInput.css';

export default class ChatInput extends Component {
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
            <div className='text-form'>
                <div className='input-container'>
                    <MDBInput
                        type="text"
                        placeholder="Enter your message"
                        onChange={this.handleTextChange}
                        value={message}
                        className='text-input'
                    />
                </div>
                <div className='button-container'>
                    <MDBBtn
                        color="primary"
                        onClick={this.handleSubmit}
                        className='text-button'>
                        Send
                    </MDBBtn>
                </div>
            </div>
        )
    }
}
