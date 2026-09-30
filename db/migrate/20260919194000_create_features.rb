class CreateFeatures < ActiveRecord::Migration[6.1]
  def change
    create_table :features do |t|
      t.references :character, null: false, foreign_key: true
      t.string :category, null: false, default: "other"
      t.string :name, null: false
      t.text :description
      t.integer :tracker_id
      t.integer :position, null: false, default: 0
      t.timestamps
    end
  end
end
