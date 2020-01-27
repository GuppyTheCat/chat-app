import React, { Component } from 'react';
import './ChatMessages.css';

export default class ChatMessages extends Component {

    constructor(props) {
        super(props)

        this.state = {
            activeChatData: {}
        }
    }

    //Scroll down when new message appears
    scrollDown = () => {
        const { container } = this.refs
        container.scrollTop = container.scrollHeight
    }

    componentDidMount() {
        this.scrollDown();
    }


    componentDidUpdate(prevProps) {
        this.scrollDown();
        //Rerender at props change
        if (prevProps !== this.props)
            this.getActiveChatData();
    }

    getActiveChatData = () => {
        const { activeChat, chats } = this.props;
        if (activeChat && chats.length > 0) {
            let activeChatData = chats.filter(chat => activeChat === chat.id)[0],
                messages = activeChatData.messages,
                typingUsers = activeChatData.typingUsers
            this.setState({ activeChatData: { messages: messages, typingUsers: typingUsers } })
        }
    }

    render() {
        const { messages, typingUsers } = this.state.activeChatData;
        const { user } = this.props;

        return (
            <div ref={'container'} className="thread-container">
                <div className="thread">
                    {
                        messages &&
                        messages.map(message => {
                            return (
                                <div key={message.id} className={`message-container ${message.sender.id === user.id && 'right'}`}>
                                    <div className="time">{message.time}</div>
                                    <div className="data">
                                        <div className="message">{message.message}</div>
                                        <div className="name">{message.sender.name}</div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    {
                        typingUsers &&
                        typingUsers.map((name) => {
                            return (
                                <div key={name} className="typing-user">
                                    {`${name} is typing . . .`}
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        )
    }
}
