class Archetype < ApplicationRecord
  has_many :subclasses, dependent: :destroy
  has_many :characters, dependent: :nullify

  validates :name, presence: true, uniqueness: { case_sensitive: false }

  # Case-insensitive id lookup for the free-text name a character stores.
  def self.id_for(name)
    where("lower(name) = ?", name.to_s.downcase).pick(:id)
  end

  # --- proficiencies ---------------------------------------------------------
  def armor_proficiencies      = proficiencies["armor"] || []
  def weapon_proficiencies     = proficiencies["weapons"] || []
  def tool_proficiencies       = proficiencies["tools"] || []
  def saving_throw_proficiencies = proficiencies["saving_throws"] || []
  def skill_proficiencies = proficiencies["skills"] || []

  def caster? = spellcasting_ability.present?

  # --- features --------------------------------------------------------------
  def class_features(level = nil)
    features = self[:class_features] || []
    return features if level.nil?

    features.select { |set| set["level"] == level }
  end

  def features_at_level(level)
    class_features.select { |set| set["level"] == level }
                  .flat_map { |set| set["features"] || [] }
  end

  def feature_at_level?(level, feature_name)
    features_at_level(level).any? { |f| f["name"] == feature_name }
  end

  def all_features
    class_features.flat_map { |set| set["features"] || [] }
  end

  # --- spellcasting ----------------------------------------------------------
  def spellcasting_data = spellcasting || {}

  def cantrips_known_at_level(level)
    return 0 unless caster?

    cantrips = spellcasting_data["cantrips_known"] || {}
    threshold = cantrips.keys.map(&:to_i).sort.reverse.find { |t| level >= t }
    threshold ? cantrips[threshold.to_s] : 0
  end

  STANDARD_FULL_CASTER_SLOTS = {
    1 => [2], 2 => [3], 3 => [4, 2], 4 => [4, 3], 5 => [4, 3, 2], 6 => [4, 3, 3],
    7 => [4, 3, 3, 1], 8 => [4, 3, 3, 2], 9 => [4, 3, 3, 3, 1], 10 => [4, 3, 3, 3, 2],
    11 => [4, 3, 3, 3, 2, 1], 12 => [4, 3, 3, 3, 2, 1], 13 => [4, 3, 3, 3, 2, 1, 1],
    14 => [4, 3, 3, 3, 2, 1, 1], 15 => [4, 3, 3, 3, 2, 1, 1, 1], 16 => [4, 3, 3, 3, 2, 1, 1, 1],
    17 => [4, 3, 3, 3, 2, 1, 1, 1, 1], 18 => [4, 3, 3, 3, 3, 1, 1, 1, 1],
    19 => [4, 3, 3, 3, 3, 2, 1, 1, 1], 20 => [4, 3, 3, 3, 3, 2, 2, 1, 1]
  }.freeze

  STANDARD_HALF_CASTER_SLOTS = {
    1 => [], 2 => [2], 3 => [3], 4 => [3], 5 => [4, 2], 6 => [4, 2], 7 => [4, 3], 8 => [4, 3],
    9 => [4, 3, 2], 10 => [4, 3, 2], 11 => [4, 3, 3], 12 => [4, 3, 3], 13 => [4, 3, 3, 1],
    14 => [4, 3, 3, 1], 15 => [4, 3, 3, 2], 16 => [4, 3, 3, 2], 17 => [4, 3, 3, 3, 1],
    18 => [4, 3, 3, 3, 1], 19 => [4, 3, 3, 3, 2], 20 => [4, 3, 3, 3, 2]
  }.freeze

  def spell_slots_at_level(level) # rubocop:disable Metrics/PerceivedComplexity
    return [] unless caster?

    slots = spellcasting_data["spell_slots"] || {}
    return slots[level.to_s] || [] unless slots[level.to_s].nil?

    if %i[paladin ranger].include?(name.to_sym)
      STANDARD_HALF_CASTER_SLOTS[level] || []
    elsif spellcasting_data["spells_known"].present? || spells_prepared_formula.present?
      STANDARD_FULL_CASTER_SLOTS[level] || []
    else
      []
    end
  end

  def spells_known_at_level(level)
    return nil unless caster?

    (spellcasting_data["spells_known"] || {})[level.to_s]
  end

  def spells_prepared_formula
    return nil unless caster?

    spellcasting_data.dig("spells_prepared", "formula")
  end

  def spells_in_spellbook_formula
    return nil unless caster?

    spellcasting_data.dig("spells_in_spellbook", "formula")
  end

  def spell_slot_level_at_level(level)
    return nil unless caster?

    (spellcasting_data["spell_slot_level"] || {})[level.to_s]
  end
end
