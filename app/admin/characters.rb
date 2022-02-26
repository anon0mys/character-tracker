ActiveAdmin.register Character do

  permit_params :name, :archetype, :level, :user_id
  
end
