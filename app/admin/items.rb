ActiveAdmin.register Item do
  config.sort_order = "name_asc"
  permit_params :name, :description, :item_type, :quality,
    :potential_damage, :total_charges, :value,
    :requires_attunement, :ac, :stat_bonuses, :source, :homebrew, tags: []

  index do
    selectable_column
    id_column
    column :name
    column :item_type
    column :quality
    column :source
    column :homebrew
    column :tags do |item|
      item.tags.join(", ")
    end
    column :potential_damage
    column :total_charges
    column :value
    column :requires_attunement
    column :ac
    column :holdings do |item|
      item.holdings.count
    end
  end

  show do
    attributes_table do
      row :name
      row :description
      row :item_type
      row :quality
      row :source
      row :homebrew
      row :tags do |item|
        item.tags.join(", ")
      end
      row :potential_damage
      row :total_charges
      row :value
      row :requires_attunement
      row :ac
      row :stat_bonuses
    end
  end

  filter :name
  filter :item_type, as: :select, collection: Item::ITEM_TYPES
  filter :quality, as: :select, collection: Item::QUALITIES
  filter :source
  filter :homebrew
  filter :potential_damage
  filter :total_charges
  filter :value
  filter :requires_attunement
  filter :ac

  form do |f|
    f.inputs do
      f.input :name
      f.input :description
      f.input :item_type, as: :select, collection: Item::ITEM_TYPES
      f.input :quality, as: :select, collection: Item::QUALITIES
      f.input :source
      f.input :homebrew
      f.input :potential_damage
      f.input :total_charges
      f.input :value
      f.input :requires_attunement, label: "Requires Attunement?"
      f.input :ac
      f.input :stat_bonuses
    end
    f.actions
  end
end
