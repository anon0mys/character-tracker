class LocationSerializer < Blueprinter::Base
  identifier :id

  fields :game_id, :name, :description, :location_type
end
