class CreateCharacters < ActiveRecord::Migration[6.1]
  def change
    create_table :characters do |t|
      t.string :name
      t.integer :archetype
      t.integer :level, default: 1
      t.references :user

      t.timestamps
    end
  end
end
