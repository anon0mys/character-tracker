class RemoveUniqueIndexFromAttacksCharacterId < ActiveRecord::Migration[6.1]
  def change
    remove_index :attacks, :character_id, if_exists: true
    add_index :attacks, :character_id
  end
end

