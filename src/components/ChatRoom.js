import React, { Component } from 'react';
import TextInput from './TextInput';
import './ChatRoom.css';
import ChatMessages from './ChatMessages';

export default class ChatRoom extends Component {

    constructor(props) {
        super(props)

        this.state = {

        }
    }

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
