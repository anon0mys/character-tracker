import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Header } from 'semantic-ui-react'
import { useAuth } from '../Auth'
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

    const characterCards = characters.map(character => {
        return (
            <Card key={character.id} as={Link} to={`/characters/${character.id}`}>
                <Card.Content>
                    <Card.Header>{character.name}</Card.Header>
                    <Card.Meta>{character.archetype}</Card.Meta>
                    <Card.Meta>Level {character.level}</Card.Meta>
                </Card.Content>
            </Card>
        )
    })

    return (
        <>
            <Header size='large'>Characters</Header>
            <Card.Group>{characterCards}</Card.Group>
        </>
    )
}

export default Characters