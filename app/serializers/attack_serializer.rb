class AttackSerializer < Blueprinter::Base
  identifier :id

  fields :id, :name, :bonus, :description, :character_id
end
