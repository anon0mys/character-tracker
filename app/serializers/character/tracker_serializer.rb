class Character
  class TrackerSerializer < Blueprinter::Base
    identifier :id

    fields :id, :character_id, :name, :max_uses, :current_uses,
      :reset_on, :category, :description, :sort_order
  end
end
