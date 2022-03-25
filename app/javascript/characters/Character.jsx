import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useClient from '../Client'
import { Button, Flex } from '../elements'
import { useAuth } from '../auth/AuthContext'
import { SpellLists, SpellListModal } from '../spellLists'

const Character = () => {
    const params = useParams()
    const auth = useAuth()
    const client = useClient()
    const [ character, setCharacter ] = useState({})
    const [ spellLists, setSpellLists ] = useState([])
    const [ modalDisplayed, setModalDisplayed ] = useState(false)

    useEffect(() => {
        client.Get(`/characters/${params.id}`, {token: auth.token})
            .then(data => setCharacter(data.character))
    }, [])

    useEffect(() => {
        client.Get(`/characters/${params.id}/spell_lists`, { token: auth.token })
            .then(data => setSpellLists(data.spell_lists))
    }, [])

    const toggleModal = () => {
        setModalDisplayed(!modalDisplayed)
    }

    const addSpellList = (data) => {
        debugger
    }

    return (
        <Flex flexDirection='column'>
            <span>Name: {character.name}</span>
            <span>Archetype: {character.archetype}</span>
            <span>Level: {character.level}</span>
            <SpellLists characterId={character.id} spellLists={spellLists} />
            <Button onClick={toggleModal}>Create Spell List</Button>
            <SpellListModal
                characterId={character.id}
                displayed={modalDisplayed}
                close={toggleModal}
                onSubmit={addSpellList}
            />
        </Flex>
    )
}

export default Character