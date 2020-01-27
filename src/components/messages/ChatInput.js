import React, { Component } from 'react';
import { MDBInput, MDBBtn } from 'mdbreact';
import { CREATE_NEW_MESSAGE } from '../../Events';
import './ChatInput.css';

export default class ChatInput extends Component {
    constructor(props) {
        super(props);
        this.state = { message: "", isTyping: false };
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if (this.state.message !== '') {
            this.sendMessage();
            this.setState({ message: '' });
        }
    }

    handleTextChange = (e) => {
        this.setState({ message: e.target.value })
    }

    sendMessage = () => {
        const { activeChat, user, socket } = this.props;
        const { message } = this.state;
        socket.emit(CREATE_NEW_MESSAGE, activeChat, user, message)
    }




    componentWillUnmount() {
        this.stopCheckingTyping();

    }

    sendTyping() {

        this.lastUpdateTime = Date.now()
        if (!this.state.isTyping) {
            this.setState({ isTyping: true })
            this.props.sendTyping(true);
            this.startCheckingTyping()
        }
    }

    startCheckingTyping() {
        this.typingInterval = setInterval(() => {

            if ((Date.now() - this.lastUpdateTime) > 300) {
                this.setState({ isTyping: false })
                this.stopCheckingTyping()
            }
        }, 300)
    }

    stopCheckingTyping() {
        if (this.typingInterval) {
            clearInterval(this.typingInterval)
            this.props.sendTyping(false)
        }
    }

    render() {
        const { message, isTyping } = this.state
        return (
            <div className='text-form'>
                <div className='input-container'>
                    <MDBInput
                        type="text"
                        placeholder="Enter your message"
                        onChange={this.handleTextChange}
                        value={message}
                        className='text-input'
                        onKeyUp={(e) => { e.keyCode === 13 ? this.handleSubmit(e) : this.sendTyping() }}
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
