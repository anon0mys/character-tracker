import React, { useEffect, useState } from 'react'
import { Button, CheckIcon, Group, Modal, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications';
import { Client, ICharacterType, ISpellListType, ISpellType } from '../../Api'
import { useAuth } from '../../Auth'
import { useError } from '../../Errors'
import Select from '../Shared/Select'

interface AddSpellProps {
    spell?: ISpellType
    opened: boolean
    onClose: VoidFunction
    onSubmit: VoidFunction
}

interface AddSpellFormType {
    character?: ICharacterType
    spellList?: ISpellListType
}

const AddSpellForm = ({ spell, opened, onClose, onSubmit }: AddSpellProps) => {
    const form = useForm<AddSpellFormType>({
        initialValues: {
            character: undefined,
            spellList: undefined
        }
    });
    const [characters, setCharacters] = useState<ICharacterType[]>([])
    const [spellLists, setSpellLists] = useState<ISpellListType[]>([])
    const auth = useAuth()
    const client = Client()
    const errors = useError()

    useEffect(() => {
        client.get({ path: `/characters`, token: auth.getToken() })
            .then(response => setCharacters(response.data))
            .catch(error => notifications.show({
                title: 'Something went wrong',
                message: error,
                color: 'red',
            }))
    }, [])

    const fetchSpellLists = (characterId) => {
        client.get({ path: `/characters/${characterId}/spell_lists`, token: auth.getToken() })
            .then(response => setSpellLists(response.data))
            .catch(error => notifications.show({
                title: 'Something went wrong',
                message: error,
                color: 'red',
            }))
    }

    const submit = () => {
        const path = `/characters/${form.values.character?.id}/spell_lists/${form.values.spellList?.id}/add_spell`
        client.post({ path: path, token: auth.getToken(), payload: {spell: {id: spell.id}}})
            .then(response => {
                notifications.show({
                    title: 'Success!',
                    message: `Added ${spell.name} to Spell List: ${form.values.spellList?.name}`,
                })
            })
            .catch(error => notifications.show({
                title: 'Something went wrong',
                message: error,
                color: 'red',
            }))
        onClose()
        onSubmit()
    }

    const pickCharacter = (e) => {
        let char = characters.find(ch => ch.id == e.target.value)
        if (char) {
            form.setValues({character: char})
            fetchSpellLists(char.id)
        }
    }

    const pickSpellList = (e) => {
        let spellList = spellLists.find(sp => sp.id == e.target.value)
        if (spellList) {
            form.setValues({spellList: spellList})
        }
    }

    const missingData = !form.values.character?.id || !form.values.spellList?.id

    return (
        <Modal opened={opened} onClose={onClose} title="Add Spell to List" centered>
            <Title order={2}>Add to Spell List</Title>
            <Group>
                <Select
                    label="Character"
                    data={characters.map(ch => {
                        return { label: ch.name, value: ch.id }
                    })}
                    {...form.getInputProps('character')}
                    value={form.values.character && form.values.character.id}
                    onChange={pickCharacter}
                />
                {
                    form.values.character?.id && <Select
                        label="Spell List"
                        data={spellLists.map(sp => {
                            return { label: sp.name, value: sp.id }
                        })}
                        {...form.getInputProps('spellList')}
                        value={form.values.spellList && form.values.spellList.id}
                        onChange={pickSpellList}
                    />
                }
            </Group>
            <Button
                leftSection={<CheckIcon />}
                disabled={missingData}
                onClick={submit}
            >
                Add to List
            </Button>
        </Modal>
    )
}

export default AddSpellForm