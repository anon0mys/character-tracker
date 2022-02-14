class CreateSpellListItem < ActiveRecord::Migration[6.1]
  def change
    create_table :spell_list_items do |t|
      t.references :spell_list
      t.references :spell

      t.timestamps
    end
  end
end
