import React, { useEffect, useState } from 'react'
import { useAuth } from '../Auth'
import { CharacterCard } from '../Components/Characters'
import Client from '../Client'
import { useError } from '../Errors'
import { ICharacterType } from '../Components/Characters'

const Characters = () => {
    const [characters, setCharacters] = useState<[ICharacterType] | []>([])
    const auth = useAuth()
    const client = Client()
    const errors = useError()

    useEffect(() => {
        client.get({path: '/characters', token: auth.getToken()})
            .then(data => setCharacters(data.characters))
            .catch(error => errors.setError(error))
    }, [])

    const characterData = characters.map(character => {
        return <CharacterCard key={character.id} data={character} />
    })

    return (
        <>
            <h1>Characters</h1>
            <div>
                {characterData}
            </div>
        </>
    )
}

export default Characters