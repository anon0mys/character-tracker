ActiveAdmin.register Spell do
  config.sort_order = 'name_asc'

  index do
    selectable_column
    id_column
    column :name
    column :archetypes
    column :level
    column :school
    column :casting_time
    column :range
    column :duration
    column :components
  end

  filter :name
  filter :archetype, as: :select, collection: Archetypes.names
  filter :level, as: :select, collection: Spell::LEVELS
  filter :school, as: :select, collection: Spell::SCHOOLS
  filter :casting_time
  
end
