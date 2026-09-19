class AttackSerializer < Blueprinter::Base
  identifier :id

  fields :id, :name, :bonus, :damage, :description, :character_id
end
