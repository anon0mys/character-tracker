class AddConditionsToCharacters < ActiveRecord::Migration[6.1]
  def change
    add_column :characters, :conditions, :string, array: true, default: [], null: false
  end
end
