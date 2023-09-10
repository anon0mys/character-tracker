import React from "react"
import { AbilityTypes, ICharacterStats } from "./types"

interface CharacterStatsProps {
    formData: ICharacterStats,
    setFormData: Function,
}

const abilities: AbilityTypes[] = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma']

const CharacterStatsForm = ({ formData, setFormData }: CharacterStatsProps) => {

    const setProficiencies = (ability) => {
        const proficiencies = formData.proficiencies
        if (proficiencies.includes(ability)) {
            const index = proficiencies.indexOf(ability)
            proficiencies.splice(index, 1)
            return proficiencies
        }
        return [...proficiencies, ability]
    }

    const abilityCheckboxes = abilities.map(ability => {
        return (
            <label key={ability}>
                <input
                    type="checkbox"
                    value={ability}
                    checked={formData.proficiencies.includes(ability)}
                    onChange={e => {
                        setFormData({
                            ...formData,
                            proficiencies: setProficiencies(e.target.value)
                        })
                    }}
                />
                {ability}
            </label>
        )
    })

    return (
        <div>
            <h2>What are your stats?</h2>
            <label>
                Level:
                <input
                    name="level"
                    value={formData.level}
                    onChange={e => {
                        setFormData({
                            ...formData,
                            level: e.target.value,
                        })
                    }}
                />
            </label>
            <label>
                Speed:
                <input
                    name="speed"
                    value={formData.speed}
                    onChange={e => {
                        setFormData({
                            ...formData,
                            speed: e.target.value,
                        })
                    }}
                />
            </label>
            <label>
                Initiative Bonus:
                <input
                    name="initiativeBonus"
                    value={formData.initiativeBonus}
                    onChange={e => {
                        setFormData({
                            ...formData,
                            initiativeBonus: e.target.value,
                        })
                    }}
                />
            </label>
            <label>
                AC Bonus:
                <input
                    name="acBonus"
                    value={formData.acBonus}
                    onChange={e => {
                        setFormData({
                            ...formData,
                            acBonus: e.target.value,
                        })
                    }}
                />
            </label>
            <div>
                Proficiencies:
                {abilityCheckboxes}
            </div>
        </div>
    )
}

export default CharacterStatsForm