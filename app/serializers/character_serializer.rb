class CharacterSerializer < Blueprinter::Base
  identifier :id

  fields :id, :name, :race, :level, :background, :alignment, :age, :ac,
    :initiative, :speed, :perception, :proficiency_bonus, :proficiencies,
    :concentration, :spell_attack_mod, :spell_save_dc, :total_hitpoints,
    :current_hitpoints, :max_hitpoints, :max_hitpoints_bonus, :temp_hitpoints,
    :hit_dice_remaining, :hit_die_type, :inspiration, :death_save_successes,
    :death_save_failures, :exhaustion, :spell_slots_used, :spell_slots_max,
    :pact_slot_level, :concentration_spell, :notes, :conditions,
    :subclass, :trait, :ideal, :flaw, :bond, :languages,
    :copper, :silver, :electrum, :gold, :platinum

  association :current_spell_list, blueprint: SpellListSerializer
  association :attacks, blueprint: AttackSerializer
  association :character_trackers, blueprint: Character::TrackerSerializer

  field :skills do |character, _options|
    character.skills
  end

  field :hit_die do |character, _options|
    character.archetype.hit_die
  end

  # Fractions of max HP where the bar flips tier. Hardcoded to match
  # #injury_condition below; Phase 4g moves these to the game.
  field :hp_thresholds do |_character, _options|
    { bloodied: 0.5, mangled: 0.25 }
  end

  field :injury_condition do |character, _options|
    if character.current_hitpoints < (character.total_hitpoints * 0.25).floor
      "Mangled"
    elsif character.current_hitpoints < (character.total_hitpoints * 0.5).floor
      "Bloodied"
    else
      "Healthy"
    end
  end

  field :archetype do |character, _options|
    character.archetype.name.to_s.capitalize
  end

  field :alignment do |character, _options|
    alignment_map = {
      "LG" => "Lawful Good",
      "NG" => "Neutral Good",
      "CG" => "Chaotic Good",
      "LN" => "Lawful Neutral",
      "TN" => "Neutral",
      "CN" => "Chaotic Neutral",
      "LE" => "Lawful Evil",
      "NE" => "Neutral Evil",
      "CE" => "Chaotic Evil",
      "UN" => "Unaligned",
    }
    alignment_map[character.alignment]
  end

  field :strength, extractor: Extractors::AbilityDataExtractor
  field :dexterity, extractor: Extractors::AbilityDataExtractor
  field :constitution, extractor: Extractors::AbilityDataExtractor
  field :intelligence, extractor: Extractors::AbilityDataExtractor
  field :wisdom, extractor: Extractors::AbilityDataExtractor
  field :charisma, extractor: Extractors::AbilityDataExtractor
end
