const abilities = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];
const archetypes = [
  "artificer",
  "barbarian",
  "bard",
  "cleric",
  "druid",
  "fighter",
  "monk",
  "paladin",
  "ranger",
  "rogue",
  "sorcerer",
  "warlock",
  "wizard",
];
const spellLevels = ["cantrip", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
const schools = [
  "abjuration",
  "conjuration",
  "divination",
  "enchantment",
  "evocation",
  "illusion",
  "necromancy",
  "transmutation",
];
const holdingStatuses = [
  "equipped",
  "carried",
  "stored",
  "sold",
  "lost",
  "destroyed",
] as const;
const goneStatuses = ["sold", "lost", "destroyed"] as const;
const item_types = [
  "ammo",
  "arcane",
  "armor",
  "gear",
  "gem",
  "holy",
  "jewelry",
  "poison",
  "potion",
  "rod",
  "scroll",
  "staff",
  "tool",
  "wand",
  "weapon",
  "wondrous",
];
const qualities = [
  "common",
  "uncommon",
  "rare",
  "very_rare",
  "legendary",
  "artifact",
];
const backgrounds = [
  "Acolyte",
  "Charlatan",
  "Criminal",
  "Entertainer",
  "Folk Hero",
  "Guild Artisan",
  "Hermit",
  "Noble",
  "Outlander",
  "Sage",
  "Sailor",
  "Soldier",
  "Urchin",
];

export {
  abilities,
  archetypes,
  spellLevels,
  schools,
  holdingStatuses,
  goneStatuses,
  item_types,
  qualities,
  backgrounds,
};
