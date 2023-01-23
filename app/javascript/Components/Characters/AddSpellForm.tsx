import React, { useEffect, useState } from 'react'
import {
    Button, Modal, ModalContent, ModalFooter, ModalHeader,
    ModalOverlay, Select, Stack
} from '@chakra-ui/react'
import { CheckIcon } from '@chakra-ui/icons'
import { Client, ICharacterType, ISpellListType, ISpellType } from '../../Api'
import { useAuth } from '../../Auth'
import { useError } from '../../Errors'

interface AddSpellProps {
    spell: ISpellType
    open: boolean
    close: VoidFunction
}

const AddSpellForm = ({ spell, open, close }: AddSpellProps) => {
    const [character, setCharacter] = useState<ICharacterType>({
        name: '',
        archetype: '',
        level: null,
        created_at: '',
        updated_at: '',
        user_id: null
    })
    const [spellList, setSpellList] = useState<ISpellListType>({
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
                close()
            })
            .catch(error => errors.setError(error)) 
    }

    const characterOptions = characters.map(character => {
        return <option key={character.id} value={character.id}>{character.name}</option>
    })

    const pickCharacter = (e) => {
        let char = characters.find(ch => ch.id == e.target.value)
        if (char) {
            setCharacter(char)
            fetchSpellLists(char.id)
        }
    }

    const pickSpellList = (e) => {
        let spellList = spellLists.find(sp => sp.id == e.target.value)
        if (spellList) {
            setSpellList(spellList)
        }
    }

    const characterSelect = (
        <Select
            placeholder='Select option'
            onChange={pickCharacter}
        >
            {characterOptions}
        </Select>
    )

    const spellListOptions = spellLists.map(spellList => {
        return <option key={spellList.id} value={spellList.id}>{spellList.name}</option>
    })

    const spellListSelect = (
        <Select
            placeholder='Select option'
            onChange={pickSpellList}
        >
            {spellListOptions}
        </Select>
    )

    const missingData = !character.id || !spellList.id

    return (
        <Modal isOpen={open} onClose={close}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add to Spell List</ModalHeader>
                <Stack>
                    {characterSelect}
                    {character.id && spellListSelect}
                </Stack>
                <ModalFooter>
                    <Button
                        leftIcon={<CheckIcon />}
                        isDisabled={missingData}
                        colorScheme='teal'
                        variant='solid'
                        onClick={submit}
                    >
                        Add to List
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AddSpellForm