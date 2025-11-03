ActiveAdmin.register Item do
  config.sort_order = "name_asc"
  permit_params :name, :description, :item_type, :status, :quality,
    :potential_damage, :total_charges, :value, :quantity,
    :requires_attunement, :ac, :stat_bonuses, character_ids: []

  index do
    selectable_column
    id_column
    column :name
    column :item_type
    column :status
    column :quality
    column :potential_damage
    column :total_charges
    column :value
    column :quantity
    column :requires_attunement
    column :ac
    column :stat_bonuses
    column :characters do |item|
      item.characters.map(&:name).join(", ")
    end
  end

  show do
    attributes_table do
      row :name
      row :description
      row :item_type
      row :status
      row :quality
      row :potential_damage
      row :total_charges
      row :value
      row :quantity
      row :requires_attunement
      row :ac
      row :stat_bonuses
      row :characters do |item|
        item.characters.map(&:name).join(", ")
      end
    end
  end

  filter :name
  filter :item_type, as: :select, collection: Item::ITEM_TYPES
  filter :status, as: :select, collection: Item::STATUSES
  filter :quality, as: :select, collection: Item::QUALITIES
  filter :potential_damage
  filter :total_charges
  filter :value
  filter :quantity
  filter :requires_attunement
  filter :ac
  filter :stat_bonuses
  filter :characters

  form do |f|
    f.inputs do
      f.input :name
      f.input :description
      f.input :item_type, as: :select, collection: Item::ITEM_TYPES
      f.input :status, as: :select, collection: Item::STATUSES
      f.input :quality, as: :select, collection: Item::QUALITIES
      f.input :potential_damage
      f.input :total_charges
      f.input :value
      f.input :quantity
      f.input :requires_attunement, label: "Requires Attunement?"
      f.input :ac
      f.input :stat_bonuses
      f.input :characters, as: :check_boxes, collection: Character.all.map { |c| [c.name, c.id] }
    end
    f.actions
  end
end
