class CreateArchetypesAndSubclasses < ActiveRecord::Migration[6.1]
  def change
    create_table :archetypes do |t|
      t.string :name, null: false
      t.string :hit_die
      t.string :spellcasting_ability
      t.string :hit_points_at_1st_level
      t.string :hit_points_at_higher_levels
      t.jsonb :proficiencies, default: {}, null: false
      t.jsonb :equipment, default: [], null: false
      t.jsonb :spellcasting, default: {}, null: false
      t.jsonb :class_features, default: [], null: false
      t.string :subclass_label
      t.string :source
      t.timestamps
    end
    add_index :archetypes, :name, unique: true

    create_table :subclasses do |t|
      t.references :archetype, null: false, foreign_key: true
      t.string :name, null: false
      t.string :slug
      t.text :description
      t.jsonb :features, default: [], null: false
      t.string :source
      t.timestamps
    end
    add_index :subclasses, %i[archetype_id name], unique: true

    add_reference :characters, :archetype, foreign_key: true
  end
end
