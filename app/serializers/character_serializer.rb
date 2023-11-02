class CharacterSerializer < Blueprinter::Base
  identifier :id

  fields :id, :name, :race, :level, :background, :alignment, :age, :ac,
        :initiative, :speed, :perception, :proficiency_bonus, :proficiencies,
        :concentration, :spell_attack_mod, :spell_save_dc

  field :archetype do |character, options|
    character.archetype.name.to_s.capitalize
  end

  field :alignment do |character, options|
    alignment_map = {
      'LG' => 'Lawful Good',
      'NG' => 'Neutral Good',
      'CG' => 'Chaotic Good',
      'LN' => 'Lawful Neutral',
      'TN' => 'Neutral',
      'CN' => 'Chaotic Neutral',
      'LE' => 'Lawful Evil',
      'NE' => 'Neutral Evil',
      'CE' => 'Chaotic Evil',
      'UN' => 'Unaligned',
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
