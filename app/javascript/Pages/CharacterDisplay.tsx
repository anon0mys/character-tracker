import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { Button, Card, Grid, Header } from 'semantic-ui-react';
import { Client, ICharacterType, ISpellListType } from '../Api';
import { useAuth } from '../Auth';
import { SpellListCard, SpellListForm } from '../Components/Characters';
import { useError } from '../Errors';

const CharacterDisplay = () => {
    const { id } = useParams()
    const [open, setOpen] = useState(false)
    const [spellLists, setSpellLists] = useState<ISpellListType[]>([])
    const [character, setCharacter] = useState<ICharacterType>({
        name: '',
        race: '',
        archetype: '',
        background: '',
        alignment: '',
        age: 20,
        level: 1,
        speed: 30,
        initiativeBonus: 0,
        acBonus: 0,
        proficiencies: [],
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
    })
    const auth = useAuth()
    const client = Client()
    const errors = useError()

    useEffect(() => {
        client.get({ path: `/characters/${id}`, token: auth.getToken() })
        .then(response => setCharacter(response.data))
        .catch(error => errors.setError(error))
    }, [id])

    useEffect(() => {
        client.get({ path: `/characters/${id}/spell_lists`, token: auth.getToken() })
        .then(response => setSpellLists(response.data))
        .catch(error => errors.setError(error))
    }, [])

    const addSpellList = (spellList: ISpellListType) => {
        setSpellLists([...spellLists, spellList])
    }

    const spellListCards = spellLists.map(spellList => {
        return <SpellListCard key={spellList.id} spellList={spellList} />
    })

    return (
        <>
            <Header>{character.name}</Header>
            <Grid columns={2}>
                <Grid.Column>{character.level}</Grid.Column>
                <Grid.Column>{character.archetype}</Grid.Column>
            </Grid>
            <Grid>
                <Grid.Column width={15}><Header>Spell Lists</Header></Grid.Column>
                <Grid.Column width={1}><Button onClick={() => setOpen(true)}>Add Spell List</Button></Grid.Column>
            </Grid>
            <Card.Group>{spellListCards}</Card.Group>
            <SpellListForm characterId={character.id} open={open} setOpen={setOpen} onSubmit={addSpellList} />
        </>
    )
}

export default CharacterDisplay