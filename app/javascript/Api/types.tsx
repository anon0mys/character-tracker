interface ICharacterType {
    id?: string;
    name: string;
    race: string;
    archetype: string;
    background: string;
    alignment: string;
    age: number;
    level: number;
    speed: number;
    initiativeBonus: number;
    acBonus: number;
    proficiencies: string[];
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
    created_at?: string;
    updated_at?: string;
    user_id?: number;
}

interface IGameType {
    id?: number;
    name: string;
    description: string;
    start_date?: string;
    created_at: string;
    updated_at: string
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
    pages: number
    page?: number
    next?: number
    prev?: number
}

export {
    ICharacterType, IGameType, IItemType, ISpellType,
    ISpellListType, IPaginationType
}