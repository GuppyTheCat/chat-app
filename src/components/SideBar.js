import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';

export default class SideBar extends Component {
    render() {
        const { chats, activeChat, user, setActiveChat, logout } = this.props;
        return (
            <React.Fragment>
                <div className="header">
                    <h3>Chat App</h3>
                </div>
                <div className="current-user">
                    <span>Hello, {user.name}!</span>
                    <Button onClick={logout} className='bg-danger'>
                        Logout
					</Button>
                </div>
                <div
                    className="users"
                    ref='users'
                    onClick={(e) => { (e.target === this.refs.user) && setActiveChat(null) }}>

                    {
                        chats.map((chat) => {
                            if (chat.name) {
                                const lastMessage = chat.messages[chat.messages.length - 1];
                                const user = chat.users.find(({ name }) => {
                                    return name !== this.props.name
                                }) || { name: "Community" }
                                const classNames = (activeChat && activeChat.id === chat.id) ? 'active' : ''
                                return (
                                    <div
                                        key={chat.id}
                                        className={`user ${classNames}`}
                                        onClick={() => { setActiveChat(chat) }}
                                    >
                                        <div className="user-photo">{user.name[0].toUpperCase()}</div>
                                        <div className="user-info">
                                            <div className="name">{user.name}</div>
                                            {lastMessage && <div className="last-message">{lastMessage.message}</div>}
                                        </div>

                                    </div>
                                )
                            }

                            return null
                        })
                    }

                </div>
            </React.Fragment>
        )
    }
}