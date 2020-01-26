import React, { Component } from 'react';
import { MDBRow, MDBCol, MDBBtn, MDBListGroup, MDBListGroupItem, MDBInput } from 'mdbreact';
import { CREATE_NEW_CHAT, UPDATE_CHAT } from '../Events';
import ChatsList from './ChatsList';
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
        socket.emit(UPDATE_CHAT, chatId);
    }

    render() {
        const { chats, user, logout, setActiveChat, socket } = this.props;
        const { newChatRoomTitle } = this.state;

        return (
            <React.Fragment>
                <MDBRow>
                    <MDBCol className='sidebar-title col-12 py-3 z-depth-1'>
                        <h4>Chat App</h4>
                    </MDBCol>
                    <MDBCol className='sidebar-greeting col-12 py-3 text-center'>
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
                        {
                            chats.map((chat) =>
                                <ChatsList
                                    key={chat.id}
                                    id={chat.id}
                                    title={chat.name}
                                    users={chat.users}
                                    setActiveChat={(chatId) => this.props.setActiveChat(chatId)}
                                    socket={socket}
                                />
                            )
                        }
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