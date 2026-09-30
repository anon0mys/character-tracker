class AddBioToCharacters < ActiveRecord::Migration[6.1]
  def change
    change_table :characters, bulk: true do |t|
      t.string :subclass
      t.text :trait
      t.text :ideal
      t.text :flaw
      t.text :bond
      t.string :languages, array: true, default: [], null: false
    end
  end
end
