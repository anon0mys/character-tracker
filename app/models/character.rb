class Character < ApplicationRecord
  extend Combinable

  ALIGNMENTS = %w[LG NG CG LN TN CN LE NE CE UN].freeze

  enum archetype: combine_to_hash(Archetypes.names)
  enum alignment: combine_to_hash(ALIGNMENTS)
  validates :name,
    :archetype,
    :race,
    :level,
    :background,
    :alignment,
    :age,
    :speed,
    :initiative_bonus,
    :ac_bonus, presence: true

  validates :strength, numericality: { in: 1..30 }
  validates :dexterity, numericality: { in: 1..30 }
  validates :constitution, numericality: { in: 1..30 }
  validates :intelligence, numericality: { in: 1..30 }
  validates :wisdom, numericality: { in: 1..30 }
  validates :charisma, numericality: { in: 1..30 }

  belongs_to :user
  belongs_to :game
  belongs_to :current_spell_list, class_name: :SpellList, optional: true
  has_many :spell_lists, dependent: :destroy
  has_many :attacks, dependent: :destroy
  has_many :character_items, dependent: :destroy
  has_many :items, through: :character_items
  has_many :character_trackers, class_name: "Character::Tracker", dependent: :destroy

  validate :current_spell_list_belongs_to_character, if: -> { current_spell_list_id.present? }

  def current_spell_list_belongs_to_character
    return unless persisted? # Skip validation for new records

    return unless current_spell_list && current_spell_list.character_id != id

    errors.add(:current_spell_list_id, "must belong to this character")
  end

  def archetype
    Archetypes.new(self[:archetype])
  end

  def add_proficiency(ability)
    self[:proficiencies] << ability
  end

  def proficiencies
    self[:proficiencies].map(&:to_sym)
  end

  def initiative
    initiative_bonus + modifier_for(:dexterity)
  end

  def perception
    10 + modifier_for(:wisdom)
  end

  def total_hitpoints
    (archetype.hit_die.split("d").last.to_i + modifier_for(:constitution)) * level
  end

  def max_hitpoints
    total_hitpoints + max_hitpoints_bonus
  end

  def current_hitpoints
    self[:current_hitpoints] || max_hitpoints
  end

  def hit_die_type
    archetype.hit_die
  end

  def spell_slots_max
    return [] unless archetype.caster?

    archetype.spell_slots_at_level(level) || []
  end

  def pact_slot_level
    return nil unless archetype.caster?

    archetype.spell_slot_level_at_level(level)
  end

  def take_short_rest!
    character_trackers.where(reset_on: "short_rest").update_all(current_uses: 0) # rubocop:disable Rails/SkipsModelValidations
    return unless pact_slot_level && spell_slots_used["pact"].to_i.positive?

    slots = spell_slots_used.dup
    slots["pact"] = 0
    update!(spell_slots_used: slots)
  end

  def take_long_rest!
    recovered = [hit_dice_remaining.to_i + [level / 2, 1].max, level].min
    update!(
      current_hitpoints: total_hitpoints, # bonus cleared, base formula becomes the new max
      temp_hitpoints: 0,
      max_hitpoints_bonus: 0,
      spell_slots_used: {},
      hit_dice_remaining: recovered,
      death_save_successes: 0,
      death_save_failures: 0,
      exhaustion: [exhaustion - 1, 0].max,
    )
    character_trackers
      .where(reset_on: %w[short_rest long_rest dawn])
      .update_all(current_uses: 0) # rubocop:disable Rails/SkipsModelValidations
  end

  def ac
    10 + ac_bonus + modifier_for(:dexterity)
  end

  def concentration
    save_for(:constitution)
  end

  def spell_attack_mod
    return unless archetype.caster?

    proficiency_bonus + modifier_for(archetype.spellcasting_ability)
  end

  def spell_save_dc
    return unless archetype.caster?

    8 + spell_attack_mod
  end

  def proficiency_bonus
    case level
    when nil
      0
    when 0..4
      2
    when 5..8
      3
    when 9..12
      4
    when 13..16
      5
    else
      6
    end
  end

  def value_of(ability)
    send(ability)
  end

  def modifier_for(ability)
    (value_of(ability) - 10) / 2
  end

  def save_for(ability)
    modifier_for(ability) + proficiency_bonus_for(ability)
  end

  def proficiency_bonus_for(ability)
    if proficiencies.include?(ability)
      proficiency_bonus
    else
      0
    end
  end

  def max_spells_prepared
    return nil unless archetype.caster?

    # For prepared casters (Cleric, Druid, Wizard, Paladin, Ranger)
    if archetype.spells_prepared_formula.present?
      formula = archetype.spells_prepared_formula
      # Parse formulas like "Wisdom modifier + Cleric level (minimum of 1)"
      # or "Intelligence modifier + Wizard level (minimum of 1)"
      archetype.spellcasting_ability.to_s.capitalize
      ability_modifier = modifier_for(archetype.spellcasting_ability)

      # Extract the formula pattern - typically "Ability modifier + Class level"
      if formula =~ /(\w+)\s+modifier\s*\+\s*(\w+)\s+level/i
        result = ability_modifier + level
        # Ensure minimum of 1
        [result, 1].max
      else
        # Fallback: try to calculate based on common pattern
        ability_modifier + level
      end
    # For known casters (Sorcerer, Warlock, Bard, Ranger, Artificer)
    elsif archetype.spells_known_at_level(level).present?
      archetype.spells_known_at_level(level)
      # For Warlocks with Pact Magic or other special cases
    end
  end

  SKILL_ABILITIES = {
    "acrobatics" => "dexterity", "animal_handling" => "wisdom", "arcana" => "intelligence",
    "athletics" => "strength", "deception" => "charisma", "history" => "intelligence",
    "insight" => "wisdom", "intimidation" => "charisma", "investigation" => "intelligence",
    "medicine" => "wisdom", "nature" => "intelligence", "perception" => "wisdom",
    "performance" => "charisma", "persuasion" => "charisma", "religion" => "intelligence",
    "sleight_of_hand" => "dexterity", "stealth" => "dexterity", "survival" => "wisdom"
  }.freeze

  def skills
    standard = CharacterService::DND_SKILLS.map do |skill|
      ability = SKILL_ABILITIES[skill]
      skill_row(skill.tr("_", " ").split.map(&:capitalize).join(" "), ability,
        proficiencies.include?(skill.to_sym), expertise.include?(skill))
    end
    custom = (custom_skills || []).map do |cs|
      skill_row(cs["name"], cs["ability"], cs["proficient"] == true, cs["expertise"] == true, custom: true)
    end
    standard + custom
  end

  def skill_row(name, ability, proficient, expert, custom: false)
    base = ability ? modifier_for(ability) : 0
    modifier = base + (proficient ? proficiency_bonus : 0) + (expert ? proficiency_bonus : 0)
    { name:, ability:, modifier:, proficient:, expertise: expert, custom: }
  end
end
