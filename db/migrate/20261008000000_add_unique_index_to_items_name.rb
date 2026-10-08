class AddUniqueIndexToItemsName < ActiveRecord::Migration[6.1]
  def change
    add_index :items, :name, unique: true
  end
end
