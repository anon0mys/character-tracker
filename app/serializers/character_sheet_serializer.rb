class CharacterSheetSerializer < Blueprinter::Base
  fields :name, :race, :level, :background, :alignment,
         :age, :ac, :initiative, :speed, :perception,
         :proficiency_bonus, :concentration

  field :archetype, name: :class do |sheet, options|
    sheet.archetype.name.to_s.capitalize
  end

  field :spell_attack_mod do |sheet, options|
    sheet.spell_attack_mod if sheet.archetype.caster?
  end

  field :spell_save_dc do |sheet, options|
    sheet.spell_save_dc if sheet.archetype.caster?
  end

  field :ability_scores do |sheet, options|
    abilities = sheet.ability_scores.attributes.keys.map(&:to_sym)
    abilities.reduce({}) do |acc, ability|
      acc[ability] = sheet.ability_data(ability)
      acc
    end
  end
end