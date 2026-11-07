# Deleting a character clears it as anyone's current character, in the
# database. The existing key had no ON DELETE, so that delete raised instead.
class AddCurrentCharacterForeignKeyToUsers < ActiveRecord::Migration[6.1]
  def up
    remove_foreign_key :users, column: :current_character_id
    add_foreign_key :users, :characters, column: :current_character_id, on_delete: :nullify
  end

  def down
    remove_foreign_key :users, column: :current_character_id
    add_foreign_key :users, :characters, column: :current_character_id
  end
end
