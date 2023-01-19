import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Avatar, Divider, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import { useAuth } from '../../Auth/AuthProvider'

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
        <Menu>
            <MenuButton
                as={Avatar}
                aria-label='Options'
                name={auth.user && auth.user.email}
                src=''
            />
            <MenuList>
                <MenuItem as={Link} to='/dashboard'>
                    Dashboard
                </MenuItem>
                <MenuItem as={Link} to='/spells'>
                    Spells
                </MenuItem>
                <MenuItem as={Link} to='/characters'>
                    Characters
                </MenuItem>
                <Divider my='5px' fontSize='2rem' />
                <MenuItem as={Link} to='/profile'>
                    Profile
                </MenuItem>
                <MenuItem onClick={signout}>
                    Log Out
                </MenuItem>
            </MenuList>
        </Menu>
    )
}

export default UserProfile