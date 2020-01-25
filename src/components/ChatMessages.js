import React, { Component } from 'react';
import './ChatMessages.css';

export default class ChatMessages extends Component {

    constructor(props) {
        super(props)

        this.state = {
            activeChatMessages: []
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.chats !== this.props.chats)
            this.activeChatMessages();
    }

    activeChatMessages = () => {
        const { activeChat, chats } = this.props;
        if (activeChat && chats.length > 0) {
            let messages = chats.filter(chat => activeChat === chat.id)[0].messages
            console.log(messages)
            this.setState({ activeChatMessages: messages })
        }
    }

    render() {
        const messages = this.state.activeChatMessages;
        const { user } = this.props;
        console.log(messages)
        return (
            <React.Fragment>
                {
                    messages &&
                    messages.map(message => {
                        return (
                            <div key={message.id} className={`message-container ${message.sender.id === user.id && 'right'}`}>
                                <div className="message">{message.message}</div>
                                <div className="name">{message.sender.name}</div>
                            </div>
                        )
                    })
                }
            </React.Fragment>
        )
    }
}