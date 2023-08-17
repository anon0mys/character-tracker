class AddCharacterSheet < ActiveRecord::Migration[6.1]
  def change
    add_column :characters, :character_sheet, :json
  end
end
