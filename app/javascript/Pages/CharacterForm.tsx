import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../Components/ui';
import { Form } from '../Components/ui';
import { useGame } from '../Contexts'
import { useAuth } from '../Auth'
import { archetypes, Client, ICharacterType } from '../Api'
import { AbilityScoresForm, CharacterBioForm, CharacterStatsForm } from '../Components/Characters';

const alignments = ['LG', 'NG', 'CG', 'LN', 'TN', 'CN', 'LE', 'NE', 'CE', 'UN']

const characterSchema = z.object({
    name: z.string().min(2, 'Name must have at least 2 letters'),
    race: z.string().min(2, 'Race must have at least 2 letters'),
    archetype: z.string().refine(val => archetypes.includes(val), 'Invalid archetype'),
    background: z.string().min(2, 'Background must have at least 2 letters'),
    alignment: z.string().refine(val => alignments.includes(val), 'Invalid alignment'),
    age: z.number().min(1, 'Age must be greater than 0'),
    level: z.number().min(1, 'Level must be greater than 0'),
    speed: z.number().min(25).max(50, 'Speed must be between 25 and 50'),
    initiativeBonus: z.number().max(20, 'Initiative bonus cannot be greater than 20'),
    acBonus: z.number().max(20, 'AC bonus cannot be greater than 20'),
    proficiencies: z.array(z.string()).default([]),
    strength: z.number().min(10).max(20, 'Strength must be between 10 and 20'),
    dexterity: z.number().min(10).max(20, 'Dexterity must be between 10 and 20'),
    constitution: z.number().min(10).max(20, 'Constitution must be between 10 and 20'),
    intelligence: z.number().min(10).max(20, 'Intelligence must be between 10 and 20'),
    wisdom: z.number().min(10).max(20, 'Wisdom must be between 10 and 20'),
    charisma: z.number().min(10).max(20, 'Charisma must be between 10 and 20'),
})

type CharacterFormData = z.infer<typeof characterSchema>

const CharacterForm = () => {
    const navigate = useNavigate()
    const auth = useAuth()
    const client = Client()
    const { game } = useGame()

    const form = useForm<CharacterFormData>({
        resolver: zodResolver(characterSchema),
        defaultValues: {
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
    });

    const handleSubmit = (values: CharacterFormData) => {
        const data = {
            game_id: game && game.id,
            ...values
        }
        client.post({ path: '/characters', payload: data, token: auth.getToken() })
            .then(data => {
                navigate('/characters')
            })
            .catch(error => {
                // Error toast is already shown by Client.tsx
                console.error('Failed to create character:', error)
            })
    }

    return (
        <div className="mx-auto max-w-5xl space-y-8">
            <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2 text-neon-cyan">Create Character</h1>
                <p className="text-muted-foreground">Fill out your character's information below</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                    <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-primary/30 shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-6 pb-2 border-b border-primary/20 text-neon-cyan">Character Bio</h2>
                        <CharacterBioForm />
                    </div>
                    <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-primary/30 shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-6 pb-2 border-b border-primary/20 text-neon-cyan">Stats & Proficiencies</h2>
                        <CharacterStatsForm />
                    </div>
                    <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-primary/30 shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-6 pb-2 border-b border-primary/20 text-neon-cyan">Ability Scores</h2>
                        <AbilityScoresForm />
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-primary/20">
                        <Button type="submit" size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 neon-glow">Create Character</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default CharacterForm