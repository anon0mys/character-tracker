import React from 'react'
import { useNavigate } from 'react-router-dom'
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

    return (
        <div>
            <p>Current User: {auth.user && auth.user.email}</p>
            <button onClick={signout}>Log Out</button>
        </div>
    )
}

export default UserProfile