import React, { Component } from 'react';
import { Container, Row, Col, Button, Form, ListGroup } from 'react-bootstrap';
import { CREATE_NEW_CHAT } from '../Events';
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
        if (chatName) {
            socket.emit(CREATE_NEW_CHAT, chatName, user);
        }
    }

    handleChatRoomTitleChange = (e) => {
        this.setState({ newChatRoomTitle: e.target.value })
    }

    render() {
        const { chats, activeChat, user, setActiveChat, logout } = this.props;
        return (
            <React.Fragment>
                <div>
                    <h4>Chat App</h4>
                    <p className='greeting'>Welcome, {user.name}!</p>
                    <Form>
                        <Form.Control type="text" placeholder="Enter chat room title" onChange={this.handleChatRoomTitleChange} />
                        <Button className='createChatButton' onClick={this.createNewChat} variant='light'>Create chat room</Button>
                    </Form>
                </div>
                <div>
                    <ListGroup>
                        {
                            chats.map((chat) =>
                                <ListGroup.Item
                                    key={chat.id}
                                    className='chatList-title'
                                    onClick={() => { setActiveChat(chat) }}
                                >
                                    {chat.name}
                                </ListGroup.Item>
                            )
                        }
                    </ListGroup>
                </div>
                <Button onClick={logout} className='bg-danger logout-button'>
                    Logout
				</Button>
            </React.Fragment>
        )
    }
}