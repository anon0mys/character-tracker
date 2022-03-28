import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Flex, NavLink } from './elements'
import { useAuth } from './auth/AuthContext'

const Navbar = () => {
    const auth = useAuth();

    const logout = (event) => {
        event.preventDefault()
        auth.signout()
    }

    const links = auth.token ? (
        <>
            <NavLink to='characters'>Characters</NavLink>
            <NavLink to='spells'>Spells</NavLink>
            <NavLink to='/' onClick={logout}>Logout</NavLink>
        </>
    ) : <NavLink to='login'>Login</NavLink>
    return (
        <Flex my={50} flexDirection='row' justifyContent='flex-end'>
            {links}
        </Flex>
    )
}

export default Navbar