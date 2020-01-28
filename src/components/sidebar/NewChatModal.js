import React, { Component } from 'react';
import { MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBInput } from 'mdbreact';
import { CREATE_NEW_CHAT } from '../../Events';
import './NewChatModal.css';

class NewChatModal extends Component {

    constructor(props) {
        super(props)

        this.state = {
            newChatRoomTitle: ''
        }
    }

    /*
    * Create new chat if chat name is valid.
    */
    createNewChat = () => {
        const { socket, user } = this.props;
        let chatName = this.state.newChatRoomTitle;
        if (chatName) {
            socket.emit(CREATE_NEW_CHAT, chatName, user);
        }
        this.closeModal();
    }

    /*
    * Handle chat name input
    */
    handleChatRoomTitleChange = (e) => {
        this.setState({ newChatRoomTitle: e.target.value })
    }

    /*
    * Close modal window
    */
    closeModal = () => {
        this.props.toggle();
        this.setState({ newChatRoomTitle: '' });
    }

    render() {
        const { newChatRoomTitle } = this.state;
        const { modal, toggle } = this.props;
        return (
            <MDBModal
                isOpen={modal}
                toggle={toggle}
                onKeyUp={(e) => { e.keyCode === 13 && this.createNewChat() }}>
                <MDBModalHeader toggle={this.toggle}>Enter chat title</MDBModalHeader>
                <MDBModalBody>
                    <MDBInput
                        type="text"
                        placeholder="Enter chat room title"
                        onChange={this.handleChatRoomTitleChange}
                        value={newChatRoomTitle}
                    />
                </MDBModalBody>
                <MDBModalFooter>
                    <MDBBtn color="secondary" onClick={this.closeModal}>Close</MDBBtn>
                    <MDBBtn onClick={this.createNewChat} color="primary">Create chat</MDBBtn>
                </MDBModalFooter>
            </MDBModal>
        );
    }
}

export default NewChatModal;