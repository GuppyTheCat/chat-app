import React, { Component } from 'react';
import { Form, Alert, Container, Row, Col } from 'react-bootstrap';
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
            <Container fluid>
                <Row className="justify-content-center align-items-center vh-100">
                    <Col sm='6 ' md='5' lg='4' xl='3'>
                        <Form onSubmit={this.handleSubmit} className='login-form'>
                            <Form.Label htmlFor='username'>Enter your nickname</Form.Label>
                            <Form.Control
                                type='text'
                                id='username'
                                value={username}
                                onChange={this.handleChange}
                                placeholder='Username' />
                            {
                                <Alert variant='danger mt-3' className={error ? 'visible' : 'invisible'}>
                                    {error}
                                </Alert>
                            }
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    }
}
