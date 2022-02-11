ActiveAdmin.register Spell do

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
  filter :archetypes
  filter :level
  filter :school
  filter :casting_time
  
end
