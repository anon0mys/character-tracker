interface ICharacterType {
    id?: number;
    name: string;
    archetype: string;
    level: number | null
    created_at: string;
    updated_at: string
    user_id: number | null
}

interface ISpellType {
    id: number | null
    name: string
    archetypes: string[]
    casting_time: string
    components: string[]
    description: string
    duration: string
    level: string
    range: string
    school: string
}

interface ISpellListType {
    id?: number
    name: string
    character_id: number | null
}

interface IPaginationType {
    data: any[]
    pages: number | null
    page: number | null
    next: number | null
    prev: number | null
}

export {ICharacterType, ISpellType, ISpellListType, IPaginationType}