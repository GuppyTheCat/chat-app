import React, { Component } from 'react';
import { MDBRow, MDBCol, MDBBtn } from 'mdbreact';
import ChatsList from './ChatsList';
import NewChatModal from './NewChatModal';
import './SideBar.css';

export default class SideBar extends Component {

    constructor(props) {
        super(props)

        this.state = {
            newChatRoomTitle: '',
            modal: false
        }
    }

    /*
    * Toggle new chat creation modal window
    */
    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    render() {
        const { chats, user, logout, socket } = this.props;
        const { modal } = this.state;

        return (
            <React.Fragment>
                <MDBRow>
                    <MDBCol className='sidebar-title col-12 py-3'>
                        <h4>Chat App</h4>
                    </MDBCol>
                    <MDBCol className='sidebar-greeting col-12 py-3 text-center'>
                        <p>Welcome, {user.name}!</p>
                    </MDBCol>
                    <MDBCol className='col-12'>
                        <MDBBtn className='createChat-button' onClick={this.toggle} color="primary">Create chat room</MDBBtn>
                        <NewChatModal
                            socket={socket}
                            user={user}
                            modal={modal}
                            toggle={this.toggle}
                        />
                    </MDBCol>
                    <MDBCol className='col-12 chat-list-container'>
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