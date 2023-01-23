ActiveAdmin.register Character do
  permit_params :name, :archetype, :level, :user_id

  form do |f|
    f.inputs do
      f.input :name
      f.input :archetype, as: :select, collection: Archetypes.names
      f.input :level
      f.input :user, as: :select, collection: User.all.map { |u| [u.email, u.id] }
    end
    f.actions
  end
  
end
