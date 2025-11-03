class Archetypes::Archetype
  attr_reader :name, :hit_die, :spellcasting_ability

  def caster?
    !!@spellcasting_ability
  end

  def class_data
    @class_data ||= Archetypes::ClassDataLoader.for_class(@name)
  end

  def proficiencies
    class_data&.dig('proficiencies') || {}
  end

  def armor_proficiencies
    proficiencies['armor'] || []
  end

  def weapon_proficiencies
    proficiencies['weapons'] || []
  end

  def tool_proficiencies
    proficiencies['tools'] || []
  end

  def saving_throw_proficiencies
    proficiencies['saving_throws'] || []
  end

  def skill_proficiencies
    proficiencies['skills'] || []
  end

  def class_features(level = nil)
    features = class_data&.dig('class_features') || []
    return features if level.nil?
    features.select { |feature_set| feature_set['level'] == level }
  end

  def features_at_level(level)
    class_features.select { |feature_set| feature_set['level'] == level }
      .flat_map { |feature_set| feature_set['features'] || [] }
  end

  def has_feature_at_level?(level, feature_name)
    features_at_level(level).any? { |feature| feature['name'] == feature_name }
  end

  def all_features
    class_features.flat_map { |feature_set| feature_set['features'] || [] }
  end

  def spellcasting_data
    class_data&.dig('spellcasting') || {}
  end

  def cantrips_known_at_level(level)
    return 0 unless caster?
    cantrips = spellcasting_data['cantrips_known'] || {}
    # Find the highest level threshold that's <= the given level
    thresholds = cantrips.keys.map(&:to_i).sort.reverse
    threshold = thresholds.find { |t| level >= t }
    threshold ? cantrips[threshold.to_s] : 0
  end

  # Standard full caster spell slot progression (Bard, Cleric, Druid, Sorcerer, Wizard)
  STANDARD_FULL_CASTER_SLOTS = {
    1 => [2],
    2 => [3],
    3 => [4, 2],
    4 => [4, 3],
    5 => [4, 3, 2],
    6 => [4, 3, 3],
    7 => [4, 3, 3, 1],
    8 => [4, 3, 3, 2],
    9 => [4, 3, 3, 3, 1],
    10 => [4, 3, 3, 3, 2],
    11 => [4, 3, 3, 3, 2, 1],
    12 => [4, 3, 3, 3, 2, 1],
    13 => [4, 3, 3, 3, 2, 1, 1],
    14 => [4, 3, 3, 3, 2, 1, 1],
    15 => [4, 3, 3, 3, 2, 1, 1, 1],
    16 => [4, 3, 3, 3, 2, 1, 1, 1],
    17 => [4, 3, 3, 3, 2, 1, 1, 1, 1],
    18 => [4, 3, 3, 3, 3, 1, 1, 1, 1],
    19 => [4, 3, 3, 3, 3, 2, 1, 1, 1],
    20 => [4, 3, 3, 3, 3, 2, 2, 1, 1]
  }.freeze

  # Half caster spell slot progression (Paladin, Ranger)
  STANDARD_HALF_CASTER_SLOTS = {
    1 => [],
    2 => [2],
    3 => [3],
    4 => [3],
    5 => [4, 2],
    6 => [4, 2],
    7 => [4, 3],
    8 => [4, 3],
    9 => [4, 3, 2],
    10 => [4, 3, 2],
    11 => [4, 3, 3],
    12 => [4, 3, 3],
    13 => [4, 3, 3, 1],
    14 => [4, 3, 3, 1],
    15 => [4, 3, 3, 2],
    16 => [4, 3, 3, 2],
    17 => [4, 3, 3, 3, 1],
    18 => [4, 3, 3, 3, 1],
    19 => [4, 3, 3, 3, 2],
    20 => [4, 3, 3, 3, 2]
  }.freeze

  def spell_slots_at_level(level)
    return [] unless caster?
    slots = spellcasting_data['spell_slots'] || {}
    # If no explicit spell slots, use standard progression
    if slots[level.to_s].nil?
      # Paladin and Ranger use half-caster progression
      if [:paladin, :ranger].include?(@name)
        STANDARD_HALF_CASTER_SLOTS[level] || []
      # Full casters use full caster progression
      else
        has_spells_known = spellcasting_data['spells_known'].present?
        has_spells_prepared = spells_prepared_formula.present?
        if has_spells_known || has_spells_prepared
          STANDARD_FULL_CASTER_SLOTS[level] || []
        else
          []
        end
      end
    else
      slots[level.to_s] || []
    end
  end

  def spells_known_at_level(level)
    return nil unless caster?
    known = spellcasting_data['spells_known'] || {}
    known[level.to_s]
  end

  def spells_prepared_formula
    return nil unless caster?
    spellcasting_data.dig('spells_prepared', 'formula')
  end

  def spells_in_spellbook_formula
    return nil unless caster?
    spellcasting_data.dig('spells_in_spellbook', 'formula')
  end

  def spell_slot_level_at_level(level)
    return nil unless caster?
    slot_level = spellcasting_data['spell_slot_level'] || {}
    slot_level[level.to_s]
  end

  def hit_points_at_1st_level
    class_data&.dig('hit_points_at_1st_level')
  end

  def hit_points_at_higher_levels
    class_data&.dig('hit_points_at_higher_levels')
  end
end

