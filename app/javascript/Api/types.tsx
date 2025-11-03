type InjuryCondition = 'Healthy' | 'Bloodied' | 'Mangled'

interface IAbilityType {
    value: number
    modifier: number
    save: number
}

interface IAttackType {
    id?: string
    name: string
    description: string
    bonus: string
    character_id: string
}

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
    ac: number;
    initiative: number;
    perception: number;
    proficiency_bonus: number;
    proficiencies: string[];
    attacks: IAttackType[]
    spell_attack_mod: number;
    spell_save_dc: number;
    concentration: number;
    total_hitpoints: number;
    current_hitpoints: number;
    injury_condition: InjuryCondition;
    current_spell_list?: ISpellListType;
    hit_die: string;
    strength: IAbilityType;
    dexterity: IAbilityType;
    constitution: IAbilityType;
    intelligence: IAbilityType;
    wisdom: IAbilityType;
    charisma: IAbilityType;
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
    spells: ISpellType[]
}

interface IPaginationType {
    data: any[]
    pages: number
    page?: number
    next?: number
    prev?: number
}

export type {
    IAttackType, ICharacterType, IGameType, IItemType, ISpellType,
    ISpellListType, IPaginationType
}