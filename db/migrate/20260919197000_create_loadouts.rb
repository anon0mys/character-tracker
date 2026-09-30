class CreateLoadouts < ActiveRecord::Migration[6.1]
  def change
    create_table :loadouts do |t|
      t.references :character, null: false, foreign_key: true
      t.string :name, null: false
      t.boolean :active, null: false, default: false
      t.jsonb :modifiers, null: false, default: { speed_bonus: 0, ac_bonus: 0, attack_ids: [], notes: "" }
      t.timestamps
    end
    add_column :attacks, :loadout_ids, :integer, array: true, default: [], null: false
  end
end
