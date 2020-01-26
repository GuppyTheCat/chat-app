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
        this.setState({ newChatRoomTitle: '' })
    }

    handleChatRoomTitleChange = (e) => {
        this.setState({ newChatRoomTitle: e.target.value })
    }

    render() {
        const { chats, user, setActiveChat, logout } = this.props;
        const { newChatRoomTitle } = this.state
        return (
            <React.Fragment>
                <Row>
                    <Col className='sidebar-title col-12 my-3'>
                        <h4>Chat App</h4>
                    </Col>
                    <Col className='sidebar-greeting col-12 mb-2'>
                        <p>Welcome, {user.name}!</p>
                    </Col>
                    <Col className='sidebar-newChatForm col-12'>
                        <Form>
                            <Form.Control 
                            type="text" 
                            placeholder="Enter chat room title" 
                            onChange={this.handleChatRoomTitleChange}
                            value={newChatRoomTitle} 
                            />
                            <Button className='createChatButton' onClick={this.createNewChat} variant='light'>Create chat room</Button>
                        </Form>
                    </Col>
                    <Col className='sidebar-chatList col-12'>
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
                    </Col>
                </Row>
                <Row>
                    <Col className='sidebar-logout'>
                        <Button onClick={logout} className='bg-danger logout-button'>
                            Logout
				        </Button>
                    </Col>
                </Row>
            </React.Fragment>
        )
    }
}