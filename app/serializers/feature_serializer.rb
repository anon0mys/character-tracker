class FeatureSerializer < Blueprinter::Base
  identifier :id

  fields :id, :character_id, :category, :name, :description, :tracker_id, :position
end
