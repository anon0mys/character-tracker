class AbilityScoresSerializer < Blueprinter::Base
  field :strength do |scores, options|
    scores.get_ability_data(:strength)
  end

  field :dexterity do |scores, options|
    scores.get_ability_data(:dexterity)
  end

  field :constitution do |scores, options|
    scores.get_ability_data(:constitution)
  end

  field :intelligence do |scores, options|
    scores.get_ability_data(:intelligence)
  end

  field :wisdom do |scores, options|
    scores.get_ability_data(:wisdom)
  end

  field :charisma do |scores, options|
    scores.get_ability_data(:charisma)
  end
end