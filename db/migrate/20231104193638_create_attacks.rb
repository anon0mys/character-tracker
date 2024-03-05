class CreateAttacks < ActiveRecord::Migration[6.1]
  def change
    create_table :attacks do |t|
      t.string :name
      t.string :bonus
      t.text :description
      t.belongs_to :character, index: { unique: true }, foreign_key: true

      t.timestamps
    end
  end
end
