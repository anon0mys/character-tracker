import { sign } from 'crypto';
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from './AuthProvider'

const UserProfile = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const signout = (event) => {
        event.preventDefault()
        auth.signout(() => {
            navigate('/');
        });
    };
    const signedIn = auth.user && auth.user.token

    const userData = (
        <div>
            <p>Current User: {auth.user && auth.user.email}</p>
            <button onClick={signout}>Log Out</button>
        </div>
    )

    const visitor = (
        <div>
            <Link to='/login'>Log In</Link>
            <Link to='/sign-up'>Sign Up</Link>
        </div>
    )

    return signedIn ? userData : visitor
}

export default UserProfile