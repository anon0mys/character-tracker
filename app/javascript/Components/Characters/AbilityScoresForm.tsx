import React from "react"
import { IAbilityScores } from "./types"

interface AbilityProps {
    formData: IAbilityScores,
    setFormData: Function,
}

const AbilityScoresForm = ({ formData, setFormData }: AbilityProps) => {
    return (
        <div>
            <h2>What are your abilities?</h2>
            <label>
                Strength:
                <input
                    name="strength"
                    value={formData.strength}
                    onChange={e => {
                        setFormData({
                            ...formData,
                            strength: e.target.value,
                        })
                    }}
                />
            </label>
            <label>
                Dexterity:
                <input
                    name="dexterity"
                    value={formData.dexterity}
                    onChange={e => {
                        setFormData({
                            ...formData,
                            dexterity: e.target.value,
                        })
                    }}
                />
            </label>
            <label>
                Constitution:
                <input
                    name="constitution"
                    value={formData.constitution}
                    onChange={e => {
                        setFormData({
                            ...formData,
                            constitution: e.target.value,
                        })
                    }}
                />
            </label>
            <label>
                Intelligence:
                <input
                    name="intelligence"
                    value={formData.intelligence}
                    onChange={e => {
                        setFormData({
                            ...formData,
                            intelligence: e.target.value,
                        })
                    }}
                />
            </label>
            <label>
                Wisdom:
                <input
                    name="wisdom"
                    value={formData.wisdom}
                    onChange={e => {
                        setFormData({
                            ...formData,
                            wisdom: e.target.value,
                        })
                    }}
                />
            </label>
            <label>
                Charisma:
                <input
                    name="charisma"
                    value={formData.charisma}
                    onChange={e => {
                        setFormData({
                            ...formData,
                            charisma: e.target.value,
                        })
                    }}
                />
            </label>
        </div>
    )
}

export default AbilityScoresForm