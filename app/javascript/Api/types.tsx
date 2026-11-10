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
  | "class"
  | "subclass"
  | "racial"
  | "background"
  | "feat"
  | "infusion"
  | "item"
  | "blessing"
  | "other";

type FeatureOrigin = "derived" | "feat" | "custom";

interface IFeature {
  id?: number | null;
  character_id?: number;
  category: FeatureCategory;
  name: string;
  description?: string;
  tracker_id?: number | null;
  position?: number;
  /** derived = projected from class/race/background; feat = chosen; custom = the character's own row */
  origin?: FeatureOrigin;
  character_feat_id?: number;
  feat_id?: number;
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
  game_id?: number;
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
  subrace?: string | null;
  race_details?: {
    size?: string;
    speed?: number;
    source?: string;
    traits: IRaceTrait[];
    subraces: string[];
  } | null;
  background_details?: {
    source?: string;
    skill_proficiencies?: string;
    tool_proficiencies?: string;
    languages?: string;
    features: IBackgroundFeature[];
    characteristics: IBackgroundType["characteristics"];
  } | null;
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
  quality: string;
  potential_damage?: number;
  total_charges?: number;
  value?: number;
  requires_attunement: boolean;
  ac?: number;
  stat_bonuses?: Object;
  source?: string | null;
  homebrew?: boolean;
  tags?: string[];
}

type HoldingStatus =
  "equipped" | "carried" | "stored" | "sold" | "lost" | "destroyed";

type HolderType = "Character" | "Npc" | "Location" | "Holding";

/** One copy, or pile, of an item somewhere in a campaign. No holder = not placed. */
interface IHoldingType {
  id: number;
  game_id: number;
  item_id: number;
  holder_type: HolderType | null;
  holder_id: number | null;
  holder_name: string | null;
  quantity: number;
  status: HoldingStatus;
  notes: string | null;
  item: Pick<
    IItemType,
    | "name"
    | "item_type"
    | "quality"
    | "homebrew"
    | "source"
    | "tags"
    | "total_charges"
    | "requires_attunement"
    | "ac"
  > & { id: number };
  description?: string | null;
}

interface INpcType {
  id: number;
  game_id: number;
  name: string;
  description: string | null;
  race: string | null;
  archetype: string | null;
  location_id: number | null;
  location_name: string | null;
  holding_count: number;
}

interface ILocationType {
  id: number;
  game_id: number;
  name: string;
  description: string | null;
  location_type: string;
  parent_id: number | null;
  parent_name: string | null;
  child_count: number;
  npc_count: number;
  holding_count: number;
}

interface IMonsterAction {
  name: string;
  desc?: string;
}

interface IMonsterType {
  id?: number;
  name: string;
  slug?: string;
  size?: string;
  creature_type?: string;
  subtype?: string;
  alignment?: string;
  armor_class?: number;
  hit_points?: number;
  challenge_rating?: string;
  strength?: number;
  dexterity?: number;
  constitution?: number;
  intelligence?: number;
  wisdom?: number;
  charisma?: number;
  description?: string;
  source?: string;
  license_url?: string;
  stat_block?: {
    speed?: Record<string, unknown>;
    senses?: string;
    languages?: string;
    special_abilities?: IMonsterAction[];
    actions?: IMonsterAction[];
    legendary_actions?: IMonsterAction[];
    reactions?: IMonsterAction[];
    [k: string]: unknown;
  };
}

interface IRaceTrait {
  name: string;
  description: string;
}

interface IRaceSubrace {
  name: string;
  description: string;
  traits: IRaceTrait[];
}

interface IRaceVersion {
  source?: string;
  description: string;
  traits: IRaceTrait[];
  subraces: IRaceSubrace[];
}

interface IRaceType {
  id?: number;
  name: string;
  slug?: string;
  category?: string;
  source?: string;
  description?: string;
  size?: string;
  speed?: number;
  traits: IRaceTrait[];
  subraces: IRaceSubrace[];
  alternate_versions: IRaceVersion[];
}

interface IBackgroundFeature {
  name: string;
  description: string;
}

interface IBackgroundType {
  id?: number;
  name: string;
  slug?: string;
  source?: string;
  description?: string;
  skill_proficiencies?: string;
  tool_proficiencies?: string;
  languages?: string;
  equipment?: string;
  features: IBackgroundFeature[];
  variants: IBackgroundFeature[];
  characteristics: {
    description?: string;
    personality_traits?: string[];
    ideals?: string[];
    bonds?: string[];
    flaws?: string[];
    [k: string]: string | string[] | undefined;
  };
}

interface IFeatType {
  id?: number;
  name: string;
  slug?: string;
  source?: string;
  prerequisite?: string;
  description?: string;
  benefits: string[];
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

type MentionableType = "Character" | "Npc" | "Item" | "Monster" | "Spell";

interface IMentionRef {
  type: MentionableType;
  id: number;
  label: string;
}

interface IMentionResult extends IMentionRef {
  detail: string;
}

/** A TipTap JSON node; the journal body and list previews use this shape. */
interface IRichNode {
  type: string;
  text?: string;
  attrs?: Record<string, any>;
  content?: IRichNode[];
}

interface IJournalEntry {
  id: number;
  game_id: number;
  number: number;
  played_on: string;
  title: string | null;
  created_at: string;
  updated_at: string;
  preview?: IRichNode | null;
  mention_count?: number;
  mentions?: IMentionRef[];
  /** Chips in the body whose person or thing has been deleted. */
  missing_mentions?: Pick<IMentionRef, "type" | "id">[];
  previous?: Pick<
    IJournalEntry,
    "id" | "number" | "title" | "played_on"
  > | null;
}

interface IJournalBacklink {
  entry_id: number;
  number: number;
  title: string | null;
  played_on: string;
  label: string;
  excerpt: string | null;
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
  FeatureOrigin,
  ILoadout,
  FeatureCategory,
  ActionType,
  ICharacterType,
  IHoldingType,
  HoldingStatus,
  HolderType,
  INpcType,
  ILocationType,
  ICharacterTrackerType,
  IGameType,
  GameStatus,
  IItemType,
  IMonsterType,
  IMonsterAction,
  IRaceType,
  IRaceTrait,
  IRaceSubrace,
  IRaceVersion,
  IBackgroundType,
  IBackgroundFeature,
  IFeatType,
  ISpellType,
  ISpellListType,
  IPaginationType,
  MentionableType,
  IMentionRef,
  IMentionResult,
  IRichNode,
  IJournalEntry,
  IJournalBacklink,
  ResetOn,
  SpellSlotsUsed,
};
