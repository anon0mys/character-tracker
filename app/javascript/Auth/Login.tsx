import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'

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
                <button onClick={login}>Log in</button>
                <Link to='/sign-up'>Sign Up</Link>
            </form>
        </div>
    )
}

export default Login