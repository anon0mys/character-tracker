import React from "react"
import { archetypes } from "../../Api"
import { AlignmentTypes, ICharacterBio } from "./types"

interface CharacterBioProps {
    formData: ICharacterBio,
    setFormData: Function,
}

const alignmentTypes: AlignmentTypes[] = ['Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil']

const CharacterBioForm = ({formData, setFormData}: CharacterBioProps) => {
    const archetypeOptions = archetypes.map(archetype => {
        return <option key={archetype} value={archetype}>{archetype}</option>
    })

    const alignmentOptions = alignmentTypes.map(alignment => {
        return <option key={alignment} value={alignment}>{alignment}</option>
    })

    return (
        <div>
            <h2>Let's start with your bio!</h2>
            <label>
                Name:
                <input
                    name="name"
                    value={formData.name}
                    onChange={e => {
                        setFormData({
                            ...formData,
                            name: e.target.value,
                        })
                    }}
                />
            </label>
            <label>
                Race:
                <input
                    name="race"
                    value={formData.race}
                    onChange={e => {
                        setFormData({
                            ...formData,
                            race: e.target.value,
                        })
                    }}
                />
            </label>
            <label>
                Class:
                <select
                    name="archetype"
                    value={formData.archetype || "placeholder"}
                    onChange={e => {
                        setFormData({
                            ...formData,
                            archetype: e.target.value,
                        })
                    }}
                >
                    <option disabled value={"placeholder"}> -- select a class -- </option>
                    {archetypeOptions}
                </select>
            </label>
            <label>
                Background:
                <input
                    name="background"
                    value={formData.background}
                    onChange={e => {
                        setFormData({
                            ...formData,
                            background: e.target.value,
                        })
                    }}
                />
            </label>
            <label>
                Alignment:
                <select
                    name="alignment"
                    value={formData.alignment || "placeholder"}
                    onChange={e => {
                        setFormData({
                            ...formData,
                            alignment: e.target.value,
                        })
                    }}
                >
                    <option disabled value={"placeholder"}> -- select an alignment -- </option>
                    {alignmentOptions}
                </select>
            </label>
            <label>
                Age:
                <input
                    name="age"
                    value={formData.age}
                    onChange={e => {
                        setFormData({
                            ...formData,
                            age: e.target.value,
                        })
                    }}
                />
            </label>
        </div>
    )
}

export default CharacterBioForm