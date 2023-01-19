import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@chakra-ui/button'
import { Wrap, WrapItem } from '@chakra-ui/react'

const VisitorNav = () => {
    return (
        <Wrap>
            <WrapItem>
                <Button as={Link} to='/login'>Log In</Button>
            </WrapItem>
            <WrapItem>
                <Button as={Link} to='/sign-up'>Sign Up</Button>
            </WrapItem>
        </Wrap>
    )
}

export default VisitorNav