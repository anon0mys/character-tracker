type InjuryCondition = "Healthy" | "Bloodied" | "Mangled";

interface IAbilityType {
  value: number;
  modifier: number;
  save: number;
}

interface ILoadout {
  id?: number;
  character_id?: number;
  name: string;
  active: boolean;
  modifiers: {
    speed_bonus?: number;
    ac_bonus?: number;
    attack_ids?: number[];
    notes?: string;
  };
}

type FeatureCategory =
  "class" | "racial" | "feat" | "infusion" | "item" | "blessing" | "other";

interface IFeature {
  id?: number;
  character_id?: number;
  category: FeatureCategory;
  name: string;
  description?: string;
  tracker_id?: number | null;
  position?: number;
}

interface ISkill {
  name: string;
  ability: string | null;
  modifier: number;
  proficient: boolean;
  expertise: boolean;
  custom?: boolean;
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
  loadout_ids?: number[];
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
  conditions?: string[];
  subclass?: string;
  subclass_label?: string;
  subclass_options?: string[];
  subclass_details?: { name: string; description?: string }[];
  trait?: string;
  ideal?: string;
  flaw?: string;
  bond?: string;
  languages?: string[];
  skills?: ISkill[];
  expertise?: string[];
  custom_skills?: {
    name: string;
    ability: string;
    proficient: boolean;
    expertise: boolean;
  }[];
  hp_thresholds?: { bloodied: number; mangled: number };
  loadouts?: ILoadout[];
  active_loadout_id?: number | null;
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

type GameStatus = "pending" | "active" | "finished" | "deleted";

interface IGameType {
  id?: number;
  name: string;
  description: string;
  start_date?: string;
  status?: GameStatus;
  hp_thresholds?: { bloodied: number; mangled: number };
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
  ISkill,
  IFeature,
  ILoadout,
  FeatureCategory,
  ActionType,
  ICharacterType,
  ICharacterItemType,
  ICharacterTrackerType,
  IGameType,
  GameStatus,
  IItemType,
  ISpellType,
  ISpellListType,
  IPaginationType,
  ResetOn,
  SpellSlotsUsed,
};
