class CharacterSheetSerializer < Blueprinter::Base
  fields :name, :race, :level, :background, :alignment,
         :age, :ac, :initiative, :speed, :perception,
         :proficiency_bonus, :spell_attack_mod, :spell_save_dc,
         :concentration

  field :archetype, name: :class do |sheet, options|
    sheet.archetype.name.to_s.capitalize
  end

  association :ability_scores, blueprint: AbilityScoresSerializer
end