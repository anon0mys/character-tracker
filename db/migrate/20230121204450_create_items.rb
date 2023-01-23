class CreateItems < ActiveRecord::Migration[6.1]
  def change
    create_table :items do |t|
      t.string :name
      t.text :description
      t.string :item_type
      t.string :status
      t.string :quality
      t.integer :potential_damage
      t.integer :total_charges
      t.integer :value
      t.integer :quantity, default: 1
      t.boolean :requires_attunement, default: false
      t.integer :ac
      t.json :stat_bonuses

      t.timestamps
    end
  end
end
