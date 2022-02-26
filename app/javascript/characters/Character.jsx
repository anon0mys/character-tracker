import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import useClient from '../Client'
import { Flex } from '../elements/Containers'
import { useAuth } from '../auth/AuthContext'

const Character = () => {
    const params = useParams()
    const auth = useAuth()
    const client = useClient()
    const [ character, setCharacter ] = useState({})

    useEffect(() => {
        client.Get(`/characters/${params.id}`, {token: auth.token})
            .then(data => setCharacter(data.character))
    }, [])

    return (
        <Flex flexDirection='column'>
            <span>Name: {character.name}</span>
            <span>Archetype: {character.archetype}</span>
            <span>Level: {character.level}</span>
        </Flex>
    )
}

export default Character