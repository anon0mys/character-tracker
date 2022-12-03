import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { Card, Grid, Header } from 'semantic-ui-react';
import { Client, ICharacterType, ISpellListType } from '../Api';
import { useAuth } from '../Auth';
import { useError } from '../Errors';

const CharacterDisplay = () => {
    const { id } = useParams()
    const [spellLists, setSpellLists] = useState<ISpellListType[]>([])
    const [character, setCharacter] = useState<ICharacterType>({
        id: null,
        name: '',
        archetype: '',
        level: null,
        created_at: '',
        updated_at: '',
        user_id: null
    })
    const auth = useAuth()
    const client = Client()
    const errors = useError()

    useEffect(() => {
        client.get({ path: `/characters/${id}`, token: auth.getToken() })
        .then(data => setCharacter(data.character))
        .catch(error => errors.setError(error))
    }, [id])

    useEffect(() => {
        client.get({ path: `/characters/${id}/spell_lists`, token: auth.getToken() })
        .then(data => setSpellLists(data.spell_lists))
        .catch(error => errors.setError(error))
    })

    const spellListCards = spellLists.map(spellList => {
        return <Card content={spellList.name}></Card>
    })

    return (
        <>
            <Header>{character.name}</Header>
            <Grid columns={2}>
                <Grid.Column>{character.level}</Grid.Column>
                <Grid.Column>{character.archetype}</Grid.Column>
            </Grid>
            <Card.Group>{spellListCards}</Card.Group>
        </>
    )
}

export default CharacterDisplay