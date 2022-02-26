import React from 'react'
import { Link } from 'react-router-dom'
import { Flex } from './elements/Containers'
import { useAuth } from './auth/AuthContext'

const Navbar = () => {
    const auth = useAuth();

    const logout = (event) => {
        event.preventDefault()
        auth.signout(() => navigate('/'))
    }

    const links = auth.token ? (
        <>
            <Link to='characters'>Characters</Link>
            <button onClick={logout}>Logout</button>
        </>
    ) : <Link to='login'>Login</Link>
    return (
        <Flex my={50}>
            {links}
        </Flex>
    )
}

export default Navbar