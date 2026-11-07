class CreateBackgrounds < ActiveRecord::Migration[6.1]
  def change
    create_table :backgrounds do |t|
      t.string :name, null: false
      t.string :slug
      t.string :source
      t.text :description
      t.string :skill_proficiencies
      t.string :tool_proficiencies
      t.string :languages
      t.text :equipment
      t.jsonb :features, default: [], null: false
      t.jsonb :variants, default: [], null: false
      t.jsonb :characteristics, default: {}, null: false
      t.timestamps
    end
    add_index :backgrounds, :name, unique: true
  end
end
