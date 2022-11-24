import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Container, Form, Grid, Header } from 'semantic-ui-react'
import { useAuth } from '../Auth'

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { from } = location.state || { from: { pathname: "/dashboard" } };
    const login = (event) => {
        event.preventDefault()
        auth.signin(email, password, () => {
            navigate(from);
        });
    };

    return (
        <Container text>
            <Header size='small'>Log In</Header>
            <Form>
                <Form.Input
                    type='email'
                    placeholder='email'
                    onChange={event => setEmail(event.target.value)}
                />
                <Form.Input
                    type='password'
                    placeholder='password'
                    onChange={event => setPassword(event.target.value)}
                />
                <Container textAlign='center'>
                    <Form.Button onClick={login}>Log in</Form.Button>
                    <Link to='/sign-up'>Sign Up</Link>
                </Container>
                
            </Form>
        </Container>
    )
}

export default Login