class AddRaceAndBackgroundRefsToCharacters < ActiveRecord::Migration[6.1]
  def change
    add_reference :characters, :race, foreign_key: true, null: true
    add_reference :characters, :background, foreign_key: true, null: true
    add_column :characters, :subrace, :string
  end
end
