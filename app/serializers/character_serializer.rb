class CharacterSerializer < Blueprinter::Base
  identifier :id

  fields :name, :race, :level, :background, :alignment, :age, :ac,
         :initiative, :speed, :perception, :proficiency_bonus,
         :concentration, :spell_attack_mod, :spell_save_dc

  field :archetype, name: :class do |character, options|
    character.archetype.name.to_s.capitalize
  end

  field :strength, extractor: Extractors::AbilityDataExtractor
  field :dexterity, extractor: Extractors::AbilityDataExtractor
  field :constitution, extractor: Extractors::AbilityDataExtractor
  field :intelligence, extractor: Extractors::AbilityDataExtractor
  field :wisdom, extractor: Extractors::AbilityDataExtractor
  field :charisma, extractor: Extractors::AbilityDataExtractor
end
