import React, { useEffect, useState } from 'react'
import useClient from '../Client'
import { useAuth } from '../auth/AuthContext'
import { Button, Form, Select, Modal } from '../elements'

const AddSpellModal = ({ spellId, displayed, close, onSubmit }) => {
    const auth = useAuth()
    const client = useClient()
    const [ spellListId, setSpellListId ] = useState()
    const [ characterId, setCharacterId ] = useState()
    const [ characters, setCharacters ] = useState([])
    const [ spellLists, setSpellLists ] = useState([])

    useEffect(() => {
        client.Get('/characters', { token: auth.token })
        .then(data => setCharacters(data.characters))
    }, [])

    useEffect(() => {
        if (characterId) {
            client.Get(`/characters/${characterId}/spell_lists`, { token: auth.token })
            .then(data => setSpellLists(data.spell_lists))
        }
    }, [characterId])

    const handleChange = (event) => {
        setSpellListId(event.target.value)
    }

    const handleCharacterChange = (event) => {
        setCharacterId(event.target.value)
    }

    const addSpellToList = (event) => {
        event.preventDefault()
        client.Post(`/characters/${characterId}/spell_lists/${spellListId}/add_spell`, {
            token: auth.token,
            payload: { spell: { id: spellId } }
        })
        .then(data => {
            if (onSubmit) {
                onSubmit(data)
            }
            close()
        })
    }

    const characterOptions = characters.map(character => {
        return <option key={character.id} value={character.id}>{character.name}</option>
    })


    const spellListOptions = spellLists.map(spellList => {
        return <option key={spellList.id} value={spellList.id}>{spellList.name} ({spellList.id})</option>
    })

    return (
        <Modal show={displayed} close={close} >
            <Form>
                <h3>Add Spell to Spell List</h3>
                <Select value={characterId} onChange={handleCharacterChange} mt='10px' >
                    <option key={1} value={null}>Select a Character</option>
                    {characterOptions}
                </Select>
                <Select placeholder='Spell List' onChange={handleChange} mt='10px' >
                    <option key={1} value={null}>Select a Spell List</option>
                    {spellListOptions}
                </Select>
                <Button onClick={addSpellToList} mt='10px' >Add to List</Button>
            </Form>
        </Modal>
    )
}

export default AddSpellModal