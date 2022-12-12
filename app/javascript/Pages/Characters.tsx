import React, { useEffect, useState } from 'react'
import { Button, Card, Grid, Header } from 'semantic-ui-react'
import { useAuth } from '../Auth'
import { useError } from '../Errors'
import { Client, ICharacterType } from '../Api'
import { CharacterCard, CharacterForm } from '../Components/Characters'

const Characters = () => {
    const [open, setOpen] = useState(false)
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

    const addCharacter = (character: ICharacterType) => {
        setCharacters([...characters, character])
    }

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
                <Grid.Column width={1}><Button onClick={() => setOpen(true)}>New Character</Button></Grid.Column>
            </Grid>
            <Card.Group>{characterCards}</Card.Group>
            <CharacterForm open={open} setOpen={setOpen} onSubmit={addCharacter} />
        </>
    )
}

export default Characters