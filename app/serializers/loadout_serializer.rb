class LoadoutSerializer < Blueprinter::Base
  identifier :id

  fields :id, :character_id, :name, :active, :modifiers
end
