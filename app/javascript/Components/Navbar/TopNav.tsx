import React from "react"
import { Flex } from "@chakra-ui/react"
import { UserProfile } from "../User"
import { useAuth } from '../../Auth/AuthProvider'
import VisitorNav from "../User/VisiitorNav"

const TopNav = () => {
    const auth = useAuth();

    return (
        <Flex justifyContent='flex-end' mr='10px'>
            { auth.user ? <UserProfile /> : <VisitorNav /> }
        </Flex>
    )
}

export default TopNav