import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Group, Box } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useGame } from '../Contexts'
import { useAuth } from '../Auth'
import { archetypes, Client, ICharacterType } from '../Api'
import { AbilityScoresForm, CharacterBioForm, CharacterStatsForm } from '../Components/Characters';

const alignments = ['LG', 'NG', 'CG', 'LN', 'TN', 'CN', 'LE', 'NE', 'CE', 'UN']

const CharacterForm = () => {
    const navigate = useNavigate()
    const auth = useAuth()
    const client = Client()
    const { game } = useGame()

    const form = useForm<ICharacterType>({
        validateInputOnBlur: true,
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
            name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
            race: (value) => (value.length < 2 ? 'Race must have at least 2 letters' : null),
            archetype: (value) => (!archetypes.includes(value) ? 'Invalid archetype' : null),
            background: (value) => (value.length < 2 ? 'Background must have at least 2 letters' : null),
            alignment: (value) => (!alignments.includes(value) ? 'Invalid alignment' : null),
            age: (value) => (value < 1 ? 'Age must be greater than 0' : null),
            level: (value) => (value < 1 ? 'Leve must be greater than 0' : null),
            speed: (value) => (value < 25 || value > 50 ? 'Speed must be between 25 and 50' : null),
            initiativeBonus: (value) => (value > 20 ? 'Initiative bonus cannot be greater than 20' : null),
            acBonus: (value) => (value > 20 ? 'AC bonus cannot be greater than 20' : null),
            strength: (value) => (value < 10 || value > 20 ? 'Strength must be between 10 and 20' : null),
            dexterity: (value) => (value < 10 || value > 20 ? 'Dexterity must be between 10 and 20' : null),
            constitution: (value) => (value < 10 || value > 20 ? 'Constitution must be between 10 and 20' : null),
            intelligence: (value) => (value < 10 || value > 20 ? 'Intelligence must be between 10 and 20' : null),
            wisdom: (value) => (value < 10 || value > 20 ? 'Wisdom must be between 10 and 20' : null),
            charisma: (value) => (value < 10 || value > 20 ? 'Charisma must be between 10 and 20' : null),
        },
    });

    const handleSubmit = (values: ICharacterType) => {
        const data = {
            game_id: game && game.id,
            ...values
        }
        client.post({ path: '/characters', payload: data, token: auth.getToken() })
            .then(data => navigate('/characters'))
            .catch(error => console.log(error))
    }

    return (
        <Box mx="auto">
            <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                <CharacterBioForm form={form} />
                <CharacterStatsForm form={form} />
                <AbilityScoresForm form={form} />

                <Group justify="flex-end" mt="md">
                    <Button type="submit">Submit</Button>
                </Group>
            </form>
        </Box>
    );
}

export default CharacterForm