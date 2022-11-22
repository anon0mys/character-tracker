import React from 'react'
import { Link } from 'react-router-dom'
import { ICharacterType } from './types'

const CharacterCard = ({data}: {data: ICharacterType}) => {
    return (
        <>
            <Link to={`/characters/${data.id}`}>{data.name}</Link>
        </>
    )
}

export default CharacterCard