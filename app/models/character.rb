class Character < ApplicationRecord
  extend Combinable

  ALIGNMENTS = %w[LG NG CG LN TN CN LE NE CE UN].freeze

  enum archetype: combine_to_hash(Archetypes.names)
  enum alignment: combine_to_hash(ALIGNMENTS)
  validates_presence_of :name,
                        :archetype,
                        :race,
                        :level,
                        :background,
                        :alignment,
                        :age,
                        :speed,
                        :initiative_bonus,
                        :ac_bonus

  validates :strength, numericality: { in: 10..20 }
  validates :dexterity, numericality: { in: 10..20 }
  validates :constitution, numericality: { in: 10..20 }
  validates :intelligence, numericality: { in: 10..20 }
  validates :wisdom, numericality: { in: 10..20 }
  validates :charisma, numericality: { in: 10..20 }

  belongs_to :user
  belongs_to :game
  has_many :spell_lists
  has_many :character_items
  has_many :items, through: :character_items

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

  def ac
    10 + ac_bonus + modifier_for(:dexterity)
  end

  def concentration
    save_for(:constitution)
  end

  def spell_attack_mod
    return if !archetype.caster?
    proficiency_bonus + modifier_for(archetype.spellcasting_ability)
  end

  def spell_save_dc
    return if !archetype.caster?
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
    self.send(ability)
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
end
