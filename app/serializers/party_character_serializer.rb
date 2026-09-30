class PartyCharacterSerializer < Blueprinter::Base
  identifier :id

  fields :id, :name, :level, :current_hitpoints, :total_hitpoints, :user_id

  field :archetype do |character, _options|
    character.archetype.name.to_s.capitalize
  end
end
