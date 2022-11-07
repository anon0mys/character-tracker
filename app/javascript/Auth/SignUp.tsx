import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'

const SignUp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const auth = useAuth();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')

    const { from } = location.state || { from: { pathname: "/" } };
    const signup = (event) => {
        event.preventDefault()
        auth.signup(email, password, passwordConfirmation, () => {
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
                <input
                    type='password'
                    placeholder='password confirmation'
                    onChange={event => setPasswordConfirmation(event.target.value)}
                />
                <button onClick={signup}>Sign Up</button>
            </form>
        </div>
    )
}

export default SignUp