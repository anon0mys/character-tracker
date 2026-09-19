class AddCurrentCharacterToUsers < ActiveRecord::Migration[6.1]
  def change
    add_reference :users, :current_character,
      null: true,
      index: true,
      foreign_key: { to_table: :characters }
  end
end
