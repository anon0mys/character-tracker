import React, { useEffect, useState } from 'react'
import { Card, Header } from 'semantic-ui-react'
import { useAuth } from '../Auth'
import { useError } from '../Errors'
import { Client, ICharacterType } from '../Api'
import { CharacterCard } from '../Components/Characters'

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

    const characterCards = characters.map(character => {
        return <CharacterCard key={character.id} character={character} />
    })

    return (
        <>
            <Header size='large'>Characters</Header>
            <Card.Group>{characterCards}</Card.Group>
        </>
    )
}

export default Characters