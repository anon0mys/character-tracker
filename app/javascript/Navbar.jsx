import React from 'react'
import { Link } from 'react-router-dom'
import { Flex } from './elements/Containers'

const Navbar = () => {
    return (
        <Flex my={50}>
            <Link to='characters'>Characters</Link>
        </Flex>
    )
}

export default Navbar