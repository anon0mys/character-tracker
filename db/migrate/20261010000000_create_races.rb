class CreateRaces < ActiveRecord::Migration[6.1]
  def change
    create_table :races do |t|
      t.string :name, null: false
      t.string :slug
      t.string :category
      t.string :source
      t.text :description
      t.string :size
      t.integer :speed
      t.jsonb :traits, default: [], null: false
      t.jsonb :subraces, default: [], null: false
      t.jsonb :alternate_versions, default: [], null: false
      t.timestamps
    end
    add_index :races, :name, unique: true
    add_index :races, :category
  end
end
