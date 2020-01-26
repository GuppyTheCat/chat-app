import React, { Component } from 'react';
import { MDBAlert, MDBContainer, MDBRow, MDBCol, MDBInput } from 'mdbreact';
import { VERIFY_USER } from '../Events';


export default class LoginForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            username: '',
            error: ''
        }
    }

    setUser = ({ user, isUser }) => {
        if (isUser) {
            this.setError('Username already exists')
        }
        else if (user.name === '') {
            this.setError('Username can\'t be empty')
        }
        else {
            this.props.setUser(user);
            this.setError('');
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { socket } = this.props;
        const { username } = this.state;
        socket.emit(VERIFY_USER, username, this.setUser);
    }
    handleChange = (e) => {
        this.setState({ username: e.target.value })
    }

    setError = (error) => {
        this.setState({ error })
    }
    render() {
        const { username, error } = this.state;
        return (
            <MDBContainer fluid>
                <MDBRow className="justify-content-center align-items-center vh-100">
                    <MDBCol sm='6 ' md='5' lg='4' xl='3'>
                        <form onSubmit={this.handleSubmit} className='login-form'>
                            <label>Enter your nickname</label>
                            <MDBInput
                                type='text'
                                id='username'
                                value={username}
                                onChange={this.handleChange}
                                placeholder='Username' />
                            {
                                <MDBAlert color='danger' className={error ? 'visible' : 'invisible'}>
                                    {error}
                                </MDBAlert>
                            }
                        </form>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        )
    }
}
