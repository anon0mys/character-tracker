import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Group, Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useGame } from '../Contexts'
import { useAuth } from '../Auth'
import { Client, ICharacterType } from '../Api'
import { CharacterBioForm } from '../Components/Characters';

const CharacterForm = () => {
    const navigate = useNavigate()
    const auth = useAuth()
    const client = Client()
    const { game } = useGame()

    const form = useForm<ICharacterType>({
        initialValues: {
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
        },

        validate: {
        },
    });

    const handleSubmit = (values) => {
        debugger
        const data = {
            name: values.name,
            archetype: values.archetype,
            game_id: game && game.id,
            character_sheet: values
        }
        client.post({ path: '/characters', payload: data, token: auth.getToken() })
            .then(data => navigate('/characters'))
            .catch(error => console.log(error))
    }

    return (
        <Box mx="auto">
            <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                <CharacterBioForm form={form} />

                <Group justify="flex-end" mt="md">
                    <Button type="submit">Submit</Button>
                </Group>
            </form>
        </Box>
    );
}

export default CharacterForm