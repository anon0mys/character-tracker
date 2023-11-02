import React, { useEffect, useState } from 'react'
import { Button, Card, Grid, Header } from 'semantic-ui-react'
import { useAuth } from '../Auth'
import { useError } from '../Errors'
import { Client, ICharacterType } from '../Api'
import { CharacterCard } from '../Components/Characters'
import { Link } from 'react-router-dom'

const Characters = () => {
    const [characters, setCharacters] = useState<ICharacterType[]>([])
    const auth = useAuth()
    const client = Client()
    const errors = useError()

    const fetchCharacters = () => {
        client.get({ path: '/characters', token: auth.getToken() })
            .then(response => setCharacters(response.data))
            .catch(error => errors.setError(error))
    }

    useEffect(() => {
        fetchCharacters()
    }, [])

    const deleteCharacter = () => {
        fetchCharacters()
    }

    const characterCards = characters.map(character => {
        return <CharacterCard key={character.id} character={character} deleteCharacter={deleteCharacter}/>
    })

    return (
        <>
            <Grid>
                <Grid.Column width={15}><Header size='large'>Characters</Header></Grid.Column>
                <Grid.Column width={1}><Button as={Link} to='/characters/create'>Create Character</Button></Grid.Column>
            </Grid>
            <Card.Group>{characterCards}</Card.Group>
        </>
    )
}

export default Characters