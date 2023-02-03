interface ICharacterType {
    id?: number;
    name: string;
    archetype: string;
    level: number | null
    created_at: string;
    updated_at: string
    user_id: number | null
}

interface IItemType {
    id?: number;
    name: string;
    description?: string;
    item_type: string;
    status: string;
    quality: string;
    potential_damage?: number;
    total_charges?: number;
    value?: number;
    quantity?: number;
    requires_attunement: boolean;
    ac?: number;
    stat_bonuses?: Object;
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

export {ICharacterType, IItemType, ISpellType, ISpellListType, IPaginationType}