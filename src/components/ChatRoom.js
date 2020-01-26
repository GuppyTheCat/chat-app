import React, { Component } from 'react';
import ChatInput from './ChatInput';
import ChatMessages from './ChatMessages';
import ChatHeader from './ChatHeader';
import './ChatRoom.css';

export default class ChatRoom extends Component {

    constructor(props) {
        super(props)

        this.state = {

        }
    }

    render() {
        const { activeChat, user, socket, chats } = this.props;

        return (
            <React.Fragment>
                <ChatHeader />
                <ChatMessages
                    chats={chats}
                    activeChat={activeChat}
                    user={user}
                />
                <ChatInput
                    socket={socket}
                    user={user}
                    activeChat={activeChat}
                />
            </React.Fragment>
        )
    }
}
