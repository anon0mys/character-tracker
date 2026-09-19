class AddNotesToCharacters < ActiveRecord::Migration[6.1]
  def change
    add_column :characters, :notes, :text
  end
end
