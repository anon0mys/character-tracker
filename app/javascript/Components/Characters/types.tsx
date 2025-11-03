type AbilityTypes = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';
type AlignmentTypes = 'Lawful Good' | 'Neutral Good' | 'Chaotic Good' | 'Lawful Neutral' | 'Neutral' | 'Chaotic Neutral' | 'Lawful Evil' | 'Neutral Evil' | 'Chaotic Evil'

interface ICharacterBio {
    name: string
    race: string
    archetype: string | null
    background: string
    alignment: AlignmentTypes | null
    age: number
}

interface ICharacterStats {
    level: number
    speed: number
    initiativeBonus: number
    acBonus: number
    proficiencies: AbilityTypes[]
}

interface IAbilityScores {
    strength: number
    dexterity: number
    constitution: number
    intelligence: number
    wisdom: number
    charisma: number
}

export type {
    AbilityTypes, AlignmentTypes, ICharacterBio, ICharacterStats, IAbilityScores
}