import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Container, Form, Header } from 'semantic-ui-react'
import { useAuth } from '../Auth'

const SignUp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')

    const { from } = location.state || { from: { pathname: "/dashboard" } };
    const signup = (event) => {
        event.preventDefault()
        auth.signup(email, password, passwordConfirmation, () => {
            navigate(from);
        });
    };

    return (
        <Container text>
            <Header size='small'>Sign Up</Header>
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
                <Form.Input
                    type='password'
                    placeholder='password confirmation'
                    onChange={event => setPasswordConfirmation(event.target.value)}
                />
                <Container textAlign='center'>
                    <Form.Button onClick={signup}>Sign Up</Form.Button>
                    <Link to='/login'>Log In</Link>
                </Container>
            </Form>
        </Container>
    )
}

export default SignUp