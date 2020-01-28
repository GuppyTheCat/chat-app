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

    /* 
    * Handle username input.
    */
    handleChange = (e) => {
        this.setState({ username: e.target.value })
    }

    /*
    * Set error to state.
    */
    setError = (error) => {
        this.setState({ error })
    }

    /*
    * Check is username valid. If true emit server verification.
    */
    handleSubmit = (e) => {
        e.preventDefault();
        const { socket } = this.props;
        const { username } = this.state;
        username === '' ?
            this.setError('Username can\'t be empty') :
            socket.emit(VERIFY_USER, username, this.setUser);
    }

    /*
    * Set active user if username is not taken.
    */
   setUser = ({ user, isUser }) => {
    if (isUser) {
        this.setError('Username already exists')
    }
    else {
        this.props.setUser(user);
        this.setError('');
    }
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
