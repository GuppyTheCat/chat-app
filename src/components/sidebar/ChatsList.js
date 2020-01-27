import React, { Component } from 'react';
import { UPDATE_CHAT } from '../../Events';
import { MDBNavbar, MDBNavbarBrand, MDBNavbarNav, MDBNavItem, MDBNavLink, MDBNavbarToggler, MDBCollapse, MDBContainer } from 'mdbreact';
import { BrowserRouter as Router } from 'react-router-dom';
import './ChatsList.css';

export default class ChatsList extends Component {
    state = {
        collapseID: ''
    };

    toggleCollapse = collapseID => () => {
        this.setState(prevState => ({
            collapseID: prevState.collapseID !== collapseID ? collapseID : ''
        }));
    };

    enterChat = (e) => {
        const { socket } = this.props;
        let chatId = e.currentTarget.getAttribute('id');
        this.props.setActiveChat(chatId);
        socket.emit(UPDATE_CHAT, chatId);
    }

    render() {
        const { id, title, users } = this.props;
        return (
            <Router>
                <MDBContainer
                    className='p-0'
                    onClick={this.enterChat}
                    id={id}
                >
                    <MDBNavbar
                        color='blue'
                        className='mt-2'
                        light
                    >
                        <MDBContainer className='p-0'>
                            <MDBNavbarBrand className='chat-title'>{title}</MDBNavbarBrand>
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