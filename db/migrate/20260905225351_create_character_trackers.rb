class CreateCharacterTrackers < ActiveRecord::Migration[6.1]
  def change
    create_table :character_trackers do |t|
      t.references :character, null: false, foreign_key: true, index: true
      t.string :name, null: false
      t.integer :max_uses, null: false
      t.integer :current_uses, default: 0, null: false
      t.string :reset_on, null: false
      t.string :category
      t.text :description
      t.integer :sort_order, default: 0, null: false

      t.timestamps
    end
  end
end
