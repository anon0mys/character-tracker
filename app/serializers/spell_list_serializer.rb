class SpellListSerializer < Blueprinter::Base
  identifier :id

  fields :id, :name, :character_id

  association :spells, blueprint: SpellSerializer
end
