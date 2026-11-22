class CreateRules < ActiveRecord::Migration[6.1]
  def change
    create_table :rules do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.string :category, null: false
      t.integer :position, null: false, default: 0
      t.text :body, null: false, default: ""
      t.string :source
      t.timestamps
    end
    add_index :rules, :slug, unique: true
    add_index :rules, :position
  end
end
