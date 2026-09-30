class AttackSerializer < Blueprinter::Base
  identifier :id

  fields :id, :name, :bonus, :damage, :description, :character_id,
    :action_type, :extra_attack, :riders, :loadout_ids
end
