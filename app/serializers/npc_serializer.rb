class NpcSerializer < Blueprinter::Base
  identifier :id

  fields :game_id, :name, :description, :race, :archetype, :location_id

  field(:location_name) { |npc| npc.location&.name }
  field(:holding_count) { |npc| npc.holdings.size }
end
