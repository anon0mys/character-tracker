import React, { useEffect, useState } from 'react'
import { Button, Dropdown, Grid, Modal } from 'semantic-ui-react'
import { Client, ICharacterType, ISpellListType, ISpellType } from '../../Api'
import { useAuth } from '../../Auth'
import { useError } from '../../Errors'

interface AddSpellProps {
    spell: ISpellType
    open: boolean
    setOpen: Function
}

const AddSpellForm = ({ spell, open, setOpen }: AddSpellProps) => {
    const [character, setCharacter] = useState<ICharacterType>({
        id: null,
        name: '',
        archetype: '',
        level: null,
        created_at: '',
        updated_at: '',
        user_id: null
    })
    const [spellList, setSpellList] = useState<ISpellListType>({
        id: null,
        name: '',
        character_id: null
    })
    const [characters, setCharacters] = useState<ICharacterType[]>([])
    const [spellLists, setSpellLists] = useState<ISpellListType[]>([])
    const auth = useAuth()
    const client = Client()
    const errors = useError()

    useEffect(() => {
        client.get({ path: `/characters`, token: auth.getToken() })
            .then(response => setCharacters(response.data))
            .catch(error => errors.setError(error))
    }, [])

    const fetchSpellLists = (characterId) => {
        client.get({ path: `/characters/${characterId}/spell_lists`, token: auth.getToken() })
            .then(response => setSpellLists(response.data))
            .catch(error => errors.setError(error))
    }

    const submit = () => {
        const path = `/characters/${character.id}/spell_lists/${spellList.id}/add_spell`
        client.post({ path: path, token: auth.getToken(), payload: {spell: {id: spell.id}}})
            .then(response => {
                console.log('probably add a banner indicating success here')
                setOpen(false)
            })
            .catch(error => errors.setError(error)) 
    }

    const characterOptions = characters.map(character => {
        return {
            key: character.id,
            text: character.name,
            value: character.id,
        }
    })

    const characterSelect = (
        <Dropdown
                placeholder='Select Character'
                search
                selection
                options={characterOptions}
                onChange={(e) => {
                    let char = characters.find(ch => ch.name === e.target.textContent)
                    if (char) {
                        setCharacter(char)
                        fetchSpellLists(char.id)
                    }
                }}
            />
    )

    const spellListOptions = spellLists.map(spellList => {
        return {
            key: spellList.id,
            text: spellList.name,
            value: spellList.id,
        }
    })

    const spellListSelect = (
        <Dropdown
                placeholder='Select Spell List'
                search
                selection
                options={spellListOptions}
                onChange={(e) => {
                    let splst = spellLists.find(sl => sl.name === e.target.textContent)
                    if (splst) {
                        setSpellList(splst)
                    }
                }}
            />
    )

    return (
        <Modal
            onClose={() => setOpen(false)}
            open={open}
            size='small'
        >
            <Modal.Header>Add to Spell List</Modal.Header>
            <Modal.Content>
                <Grid>
                    <Grid.Row>{characterSelect}</Grid.Row>
                    <Grid.Row>{character.id && spellListSelect}</Grid.Row>
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <Button
                    icon='check'
                    content='Add to List'
                    onClick={submit}
                />
            </Modal.Actions>
        </Modal>
    )
}

export default AddSpellForm