import React, { Component } from 'react';
import { Container, Row, Col, Button, Form, ListGroup } from 'react-bootstrap';
import { NEW_CHAT } from '../Events';
import './SideBar.css';

export default class SideBar extends Component {

    constructor(props) {
        super(props)

        this.state = {
            newChatRoomTitle: ''
        }
    }


    createNewChat = () => {
        const { socket } = this.props;
        let chatName = this.state.newChatRoomTitle;
        let user = this.props.user;
        if (chatName)
            socket.emit(NEW_CHAT, chatName, user);
    }

    handleChatRoomTitleChange = (e) => {
        this.setState({ newChatRoomTitle: e.target.value })
    }

    render() {
        const { chats, activeChat, user, setActiveChat, logout } = this.props;
        return (
            <React.Fragment>
                <div className="header">
                    <h3>Chat App</h3>
                </div>
                <div>
                    <p className='greeting'>Hello, {user.name}!</p>
                    <Form>
                        <Form.Control type="text" placeholder="Enter chat room title" onChange={this.handleChatRoomTitleChange} />
                        <Button onClick={this.createNewChat} variant='light'>Create chat room</Button>
                    </Form>
                </div>
                <div>
                    <ListGroup>
                        {
                            chats.map((chat) =>
                                <ListGroup.Item className='chatList-title'>{chat.name}</ListGroup.Item>
                            )
                        }
                    </ListGroup>
                </div>
                <Button className='logout-button' onClick={logout} className='bg-danger'>
                    Logout
				</Button>
            </React.Fragment>
        )
    }
}