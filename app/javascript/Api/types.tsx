interface ICharacterType {
    id: number
    name: string
    archetype: string
    level: number
    created_at: string
    updated_at: string
    user_id: number
}

interface ISpellType {
    id: number
    name: string
    archetypes: [string]
    casting_time: string
    components: [string]
    description: string
    duration: string
    level: string
    range: string
    school: string
}

interface IPaginationType {
    data: any[]
    pages: number | null
    page: number | null
    next: number | null
    prev: number | null
}

export {ICharacterType, ISpellType, IPaginationType}