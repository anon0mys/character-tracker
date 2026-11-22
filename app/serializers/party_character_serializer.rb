class PartyCharacterSerializer < Blueprinter::Base
  identifier :id

  fields :id, :name, :level, :current_hitpoints, :total_hitpoints, :user_id

  field :archetype do |character, _options|
    character.archetype.name.to_s.capitalize
  end

  # Who plays them, as other members see it.
  field(:player) { |character, _options| character.user&.display_name }
end
