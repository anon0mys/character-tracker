class CreateNpcs < ActiveRecord::Migration[6.1]
  def change
    create_table :npcs do |t|
      t.string :name
      t.string :description
      t.string :race
      t.string :archetype, null: false, default: 'artificer'
      t.belongs_to :location, index: { unique: true }, foreign_key: true

      t.timestamps
    end
  end
end
