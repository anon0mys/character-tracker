import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@chakra-ui/react'
import {
    AbilityScoresForm, CharacterBioForm, CharacterStatsForm,
    ICharacterBio, ICharacterStats, IAbilityScores
} from '../Components/Characters'
import { useGame } from '../Contexts'
import { useAuth } from '../Auth'
import { Client } from '../Api'

const CharacterCreationForm = () => {
    const navigate = useNavigate()
    const auth = useAuth()
    const client = Client()
    const { game } = useGame()
    const [characterBio, setCharacterBio] = useState<ICharacterBio>({
        name: '',
        race: '',
        archetype: null,
        background: '',
        alignment: null,
        age: 20,
    })
    const [characterStats, setCharacterStats] = useState<ICharacterStats>({
        level: 1,
        speed: 30,
        initiativeBonus: 0,
        acBonus: 0,
        proficiencies: [],
    })
    const [abilityScores, setAbilityScores] = useState<IAbilityScores>({
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
    })

    const handleSubmit = (event) => {
        event.preventDefault()
        const data = {
            name: characterBio.name,
            archetype: characterBio.archetype,
            game_id: game && game.id,
            character_sheet: {
                ...characterBio,
                level: characterStats.level,
                speed: characterStats.speed,
                initiative_bonus: characterStats.initiativeBonus,
                ac_bonus: characterStats.acBonus,
                proficiencies: characterStats.proficiencies,
                ability_scores: abilityScores,
            }
        }
        client.post({ path: '/characters', payload: data, token: auth.getToken() })
            .then(data => navigate('/characters'))
            .catch(error => console.log(error))
    }

    if (!game) {
        navigate('/dashboard')
    }

    return (
        <>
            <CharacterBioForm formData={characterBio} setFormData={setCharacterBio} />
            <CharacterStatsForm formData={characterStats} setFormData={setCharacterStats} />
            <AbilityScoresForm formData={abilityScores} setFormData={setAbilityScores} />
            <Button onClick={handleSubmit}>Submit</Button>
        </>
    )
}

export default CharacterCreationForm