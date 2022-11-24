import React from 'react'
import { useParams } from 'react-router';

const CharacterDisplay = () => {
    const { id } = useParams()

    return <>This is where character data will go. ID: {id}</>
}

export default CharacterDisplay