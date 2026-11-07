class CreateFeats < ActiveRecord::Migration[6.1]
  def change
    create_table :feats do |t|
      t.string :name, null: false
      t.string :slug
      t.string :source
      t.string :prerequisite
      t.text :description
      t.jsonb :benefits, default: [], null: false
      t.timestamps
    end
    add_index :feats, :name, unique: true
  end
end
