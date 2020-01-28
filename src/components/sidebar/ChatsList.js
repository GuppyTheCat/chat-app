import React, { Component } from 'react';
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBContainer } from 'mdbreact';
import { BrowserRouter as Router } from 'react-router-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import './ChatsList.css';

export default class ChatsList extends Component {

    constructor(props) {
        super(props)

        this.state = {
            collapseID: ''
        }
    }

    /*
    * Toggle chats tabs
    */
    toggleCollapse = collapseID => () => {
        this.setState(prevState => ({
            collapseID: prevState.collapseID !== collapseID ? collapseID : ''
        }));
    };

    /*
    * Enter chat on chat tab click
    */
    enterChat = (e) => {
        let chatId = e.currentTarget.getAttribute('id');
        this.props.setActiveChat(chatId);
    }

    render() {
        const { id, title, users, socket } = this.props;
        return (
            <Router>
                <MDBContainer
                    className='p-0'
                    onClick={this.enterChat}
                    id={id}
                >
                    <MDBNavbar
                        color='primary-color'
                        className='mt-2'
                        light
                    >
                        <MDBContainer className='p-0'>
                            <MDBNavbarBrand className='chat-title'>{title}</MDBNavbarBrand>
                            <div
                                className='chat-link'
                                onClick={() => alert(`Link for chat "${title}" copied to clipboard.\nSend it to another user, and after login he will join this chat.`)}>
                                <CopyToClipboard text={socket.io.uri.replace(/\d{4}\/$/g,'3000/') + id}>
                                    <div><i className="fas fa-clipboard" /></div>
                                </CopyToClipboard>
                            </div>
                            <MDBNavbarToggler
                                onClick={this.toggleCollapse(`navbarCollapse${id}`)}
                                className='p-0'
                            />
                            <MDBCollapse
                                id={'navbarCollapse' + id}
                                isOpen={this.state.collapseID}
                                navbar
                            >
                                <MDBNavbarNav left>
                                    {
                                        users.map((user) => {
                                            return (
                                                <MDBNavItem>
                                                    <MDBNavLink to='#'>{user.name}</MDBNavLink>
                                                </MDBNavItem>
                                            )
                                        })
                                    }
                                </MDBNavbarNav>
                            </MDBCollapse>
                        </MDBContainer>
                    </MDBNavbar>
                </MDBContainer>
            </Router>
        );
    }
}