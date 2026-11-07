class AddUsernameToUsers < ActiveRecord::Migration[6.1]
  def up
    add_column :users, :username, :string
    add_index :users, "lower(username)", unique: true, name: "index_users_on_lower_username"
  end

  # An expression index can't be reversed by column; remove it by name.
  def down
    remove_index :users, name: "index_users_on_lower_username"
    remove_column :users, :username
  end
end
