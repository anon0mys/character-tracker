import React from 'react'
import { Link } from 'react-router-dom'
import { Flex } from '../elements/Containers'

const CharacterCard = ({character}) => {

    let {id, name, archetype, level} = character

    return (
        <Flex flexDirection='column'>
            <span>Name: {name}</span>
            <span>Archetype: {archetype}</span>
            <span>Level: {level}</span>
            <Link to={`${id}`}>Manage</Link>
        </Flex>
    )
}

export default CharacterCard