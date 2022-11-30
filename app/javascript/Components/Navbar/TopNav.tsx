import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Menu } from 'semantic-ui-react'
import { UserProfile } from "../User"


const TopNav = () => {
    const location = useLocation();
    const [activeLink, setActiveLink] = useState('dashboard')

    return (
        <Menu open={true} stackable borderless size='large'>
            <Menu.Item
                name='dashboard'
                active={activeLink === 'dashboard'}
                onClick={() => setActiveLink('dashboard')}
                as={Link}
                to='/dashboard'
            >
                Dashboard
            </Menu.Item>
            <Menu.Item
                name='spells'
                active={activeLink === 'spells'}
                onClick={() => setActiveLink('spells')}
                as={Link}
                to='/spells'
            >
                Spells
            </Menu.Item>
            <Menu.Item
                name='characters'
                active={activeLink === 'characters'}
                onClick={() => setActiveLink('characters')}
                as={Link}
                to='/characters'
            >
                Characters
            </Menu.Item>
            <UserProfile activeLink={activeLink} setActiveLink={setActiveLink} />
        </Menu>
    )
}

export default TopNav