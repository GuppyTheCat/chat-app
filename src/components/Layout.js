import React, { Component } from 'react';
import io from 'socket.io-client';
import { USER_CONNECTED, LOGOUT } from '../Events';
import LoginForm from './LoginForm';
import ChatContainer from './ChatContainer';

const socketUrl = 'http://192.168.56.1:3333/';
export default class Layout extends Component {

    constructor(props) {
        super(props)

        this.state = {
            socket: null,
            user: null
        }
    }

    UNSAFE_componentWillMount() {
        this.initSocket();
    }

    /*
    * Initialize connection with server.
    */
    initSocket = () => {
        const socket = io(socketUrl);
        this.setState({ socket });
    }

    /*
    * Set active user.
    */
    setUser = (user) => {
        const { socket } = this.state;
        socket.emit(USER_CONNECTED, user);
        this.setState({ user });
    }

    /*
    * Handle logout
    */
    logout = () => {
        const { socket } = this.state;
        socket.emit(LOGOUT);
        this.setState({ user: null });
    }

    render() {
        const { user, socket } = this.state;

        return (
            <React.Fragment>
                {
                    !user ?
                        <LoginForm socket={socket} setUser={this.setUser} />
                        :
                        <ChatContainer socket={socket} user={user} logout={this.logout} />
                }
            </React.Fragment>
        );
    }
}