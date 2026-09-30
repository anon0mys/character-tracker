type InjuryCondition = "Healthy" | "Bloodied" | "Mangled";

interface IAbilityType {
  value: number;
  modifier: number;
  save: number;
}

interface IRider {
  name: string;
  tag?: string;
  damage?: string;
  note?: string;
}

type ActionType = "action" | "bonus" | "reaction" | "dash";

interface IAttackType {
  id?: string;
  name: string;
  description: string;
  bonus: string;
  damage?: string;
  character_id: string;
  action_type?: ActionType;
  extra_attack?: boolean;
  riders?: IRider[];
}

type ResetOn = "short_rest" | "long_rest" | "dawn" | "manual" | "never";

interface ICharacterTrackerType {
  id?: number;
  character_id?: number;
  name: string;
  max_uses: number;
  current_uses: number;
  reset_on: ResetOn;
  category?: string | null;
  description?: string | null;
  sort_order?: number;
}

type SpellSlotsUsed = Record<string, number>;

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
  attacks: IAttackType[];
  spell_attack_mod: number;
  spell_save_dc: number;
  concentration: number;
  total_hitpoints: number;
  current_hitpoints: number;
  max_hitpoints: number;
  max_hitpoints_bonus: number;
  temp_hitpoints: number;
  hit_dice_remaining: number | null;
  hit_die_type: string;
  inspiration: number;
  death_save_successes: number;
  death_save_failures: number;
  exhaustion: number;
  spell_slots_used: SpellSlotsUsed;
  spell_slots_max: number[];
  pact_slot_level: number | null;
  concentration_spell: string | null;
  copper: number;
  silver: number;
  electrum: number;
  gold: number;
  platinum: number;
  injury_condition: InjuryCondition;
  notes?: string;
  hp_thresholds?: { bloodied: number; mangled: number };
  current_spell_list?: ISpellListType;
  character_trackers: ICharacterTrackerType[];
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
  updated_at: string;
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

interface ICharacterItemType {
  id: number;
  item_id: number;
  name: string;
  description?: string;
  item_type: string;
  status: string;
  quality: string;
  potential_damage?: number;
  total_charges?: number;
  value?: number;
  ac?: number;
  stat_bonuses?: Object;
  requires_attunement: boolean;
  quantity: number;
}

interface ISpellType {
  id: number | null;
  name: string;
  archetypes: string[];
  casting_time: string;
  components: string[];
  description: string;
  duration: string;
  level: string;
  range: string;
  school: string;
}

interface ISpellListType {
  id?: number;
  name: string;
  character_id: number | null;
  spells: ISpellType[];
}

interface IPaginationType {
  data: any[];
  pages: number;
  page?: number;
  next?: number;
  prev?: number;
}

export type {
  IAbilityType,
  IAttackType,
  IRider,
  ActionType,
  ICharacterType,
  ICharacterItemType,
  ICharacterTrackerType,
  IGameType,
  IItemType,
  ISpellType,
  ISpellListType,
  IPaginationType,
  ResetOn,
  SpellSlotsUsed,
};
