import React, { Component } from 'react';
import { MDBRow, MDBCol, MDBBtn, MDBListGroup, MDBListGroupItem, MDBInput } from 'mdbreact';
import { CREATE_NEW_CHAT, GET_CHAT } from '../Events';
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

    enterChat = (e) => {
        const { socket } = this.props;
        let chatId = e.currentTarget.getAttribute('value');
        this.props.setActiveChat(chatId);
        socket.emit(GET_CHAT, chatId);
    }

    render() {
        const { chats, user, logout } = this.props;
        const { newChatRoomTitle } = this.state;

        return (
            <React.Fragment>
                <MDBRow>
                    <MDBCol className='sidebar-title col-12 my-3'>
                        <h4>Chat App</h4>
                    </MDBCol>
                    <MDBCol className='sidebar-greeting col-12 mb-2'>
                        <p>Welcome, {user.name}!</p>
                    </MDBCol>
                    <MDBCol className='col-12'>
                        <form>
                            <MDBInput
                                type="text"
                                placeholder="Enter chat room title"
                                onChange={this.handleChatRoomTitleChange}
                                value={newChatRoomTitle}
                            />
                            <MDBBtn className='createChat-button' onClick={this.createNewChat} color="primary">Create chat room</MDBBtn>
                        </form>
                    </MDBCol>
                    <MDBCol className='col-12'>
                        <MDBListGroup>
                            {
                                chats.map((chat) =>
                                    <MDBListGroupItem
                                        key={chat.id}
                                        className='chatList-title'
                                        value={chat.id}
                                        onClick={this.enterChat}
                                    >
                                        {chat.name}
                                    </MDBListGroupItem>
                                )
                            }
                        </MDBListGroup>
                    </MDBCol>
                </MDBRow>
                <MDBRow>
                    <MDBCol className='sidebar-logout'>
                        <MDBBtn onClick={logout} className='logout-button' color="danger">
                            Logout
				        </MDBBtn>
                    </MDBCol>
                </MDBRow>
            </React.Fragment>
        )
    }
}