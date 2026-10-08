class CreateMonsters < ActiveRecord::Migration[6.1]
  def change
    create_table :monsters do |t|
      t.string :name, null: false
      t.string :slug
      t.string :size
      t.string :creature_type
      t.string :subtype
      t.string :alignment
      t.integer :armor_class
      t.integer :hit_points
      t.string :challenge_rating
      t.integer :strength
      t.integer :dexterity
      t.integer :constitution
      t.integer :intelligence
      t.integer :wisdom
      t.integer :charisma
      t.text :description
      t.jsonb :stat_block, default: {}, null: false
      t.string :source
      t.string :license_url
      t.timestamps
    end
    add_index :monsters, :name, unique: true
    add_index :monsters, :challenge_rating
    add_index :monsters, :creature_type
  end
end
