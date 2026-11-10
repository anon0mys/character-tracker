class LocationSerializer < Blueprinter::Base
  identifier :id

  fields :game_id, :name, :description, :location_type, :parent_id

  field(:parent_name) { |location| location.parent&.name }
  field(:child_count) { |location| location.children.size }
  field(:npc_count) { |location| location.npcs.size }
  field(:holding_count) { |location| location.holdings.size }
end
