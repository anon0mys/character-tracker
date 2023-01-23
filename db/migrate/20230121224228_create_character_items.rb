class CreateCharacterItems < ActiveRecord::Migration[6.1]
  def change
    create_table :character_items do |t|
      t.belongs_to :character, foreign_key: true
      t.belongs_to :item, foreign_key: true
      t.integer :quantity

      t.timestamps
    end
  end
end
