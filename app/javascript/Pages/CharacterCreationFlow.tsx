import React, { useState } from 'react'
import { Button } from '@chakra-ui/react'
import {
    AbilityScoresForm, CharacterBioForm, CharacterStatsForm,
    ICharacterBio, ICharacterStats, IAbilityScores
} from '../Components/Characters'
import { useGame } from '../Contexts'
import { useAuth } from '../Auth'
import { Client } from '../Api'
import { redirect } from 'react-router-dom'

// Deprecated in favor of the full page form, but still fun
const CharacterCreationFlow = () => {
    const auth = useAuth()
    const client = Client()
    const { game } = useGame()
    const [step, setStep] = useState<number>(0)
    const [characterBio, setCharacterBio] = useState<ICharacterBio>({
        name: '',
        race: '',
        archetype: null,
        background: '',
        alignment: null,
        age: 10,
    })
    const [characterStats, setCharacterStats] = useState<ICharacterStats>({
        level: 1,
        speed: 10,
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
        client.post({path: '/characters', payload: data, token: auth.getToken()})
        .then(data => redirect('/characters'))
        .catch(error => console.log(error))
    }

    const stepForward = (event) => {``
        event.preventDefault()
        setStep(step + 1)
    }

    const stepBackward = (event) => {
        event.preventDefault()
        setStep(step - 1)
    }

    const buttons = () => {
        if (step == 0) {
            return (
                <>
                    <Button onClick={stepForward}>Next</Button>
                </>
            )
        } else if (step < 2) {
            return (
                <>
                    <Button onClick={stepBackward}>Back</Button>
                    <Button onClick={stepForward}>Next</Button>
                </>
            )
        } else {
            return (
                <>
                    <Button onClick={stepBackward}>Back</Button>
                    <Button onClick={handleSubmit}>Submit</Button>
                </>
            )
        }
    }

    const stepComponent = () => {
        switch (step) {
            case 0:
                return <CharacterBioForm formData={characterBio} setFormData={setCharacterBio} />
            case 1:
                return <CharacterStatsForm formData={characterStats} setFormData={setCharacterStats} />
            case 2:
                return <AbilityScoresForm formData={abilityScores} setFormData={setAbilityScores} />
            default:
                return <CharacterBioForm formData={characterBio} setFormData={setCharacterBio} />
        }
    }

    return (
        <>
            {stepComponent()}
            {buttons()}
        </>
    )
}

export default CharacterCreationFlow