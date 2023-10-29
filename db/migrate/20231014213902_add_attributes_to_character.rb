class AddAttributesToCharacter < ActiveRecord::Migration[6.1]
  def change
    add_column :characters, :race, :string
    add_column :characters, :background, :string
    add_column :characters, :alignment, :string
    add_column :characters, :age, :integer
    add_column :characters, :speed, :integer, default: 30
    add_column :characters, :initiative_bonus, :integer, default: 0
    add_column :characters, :ac_bonus, :integer, default: 0
    add_column :characters, :proficiencies, :string, array: true, default: []
    add_column :characters, :strength, :integer, default: 10
    add_column :characters, :dexterity, :integer, default: 10
    add_column :characters, :constitution, :integer, default: 10
    add_column :characters, :intelligence, :integer, default: 10
    add_column :characters, :wisdom, :integer, default: 10
    add_column :characters, :charisma, :integer, default: 10

    remove_column :characters, :character_sheet
  end
end
