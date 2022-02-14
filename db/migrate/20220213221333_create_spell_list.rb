class CreateSpellList < ActiveRecord::Migration[6.1]
  def change
    create_table :spell_lists do |t|
      t.string :name
      t.references :character

      t.timestamps
    end
  end
end
