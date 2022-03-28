import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './auth/AuthContext'
import { Button } from './elements'

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth();
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()

    const { from } = location.state || { from: { pathname: "/" } };
    const login = (event) => {
        event.preventDefault()
        auth.signin(email, password, () => {
            navigate(from);
        });
    };

    return (
        <div>
            <form>
                <input
                    type='email'
                    placeholder='email'
                    onChange={event => setEmail(event.target.value)}
                />
                <input
                    type='password'
                    placeholder='password'
                    onChange={event => setPassword(event.target.value)}
                />
                <Button onClick={login}>Log in</Button>
            </form>
        </div>
    )
}

export default Login