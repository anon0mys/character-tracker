import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import { useAuth } from '../../Auth/AuthProvider'

const UserProfile = ({activeLink, setActiveLink}) => {
    const auth = useAuth();
    const navigate = useNavigate();
    const signout = (event) => {
        event.preventDefault()
        auth.signout(() => {
            navigate('/');
        });
    };

    const userData = (
        <>
            <Menu.Item
                name='avatar'
                position='right'
                active={activeLink === 'profile'}
                onClick={() => setActiveLink('profile')}
            >
                {auth.user && auth.user.email}
            </Menu.Item>
            <Menu.Item
                name='log-out'
                active={false}
                onClick={signout}
            >
                Log Out
            </Menu.Item>
        </>
    )

    const visitor = (
        <>
            <Menu.Item
                name='login'
                position='right'
                active={activeLink === 'login'}
                as={Link}
                to='/login'
                onClick={() => setActiveLink('login')}
            >
                Log In
            </Menu.Item>
            <Menu.Item
                name='sign-up'
                active={activeLink === 'sign-up'}
                as={Link}
                to='/sign-up'
                onClick={() => setActiveLink('sign-up')}
            >
                Sign Up
            </Menu.Item>
        </>
    )

    return auth.getToken() ? userData : visitor
}

export default UserProfile