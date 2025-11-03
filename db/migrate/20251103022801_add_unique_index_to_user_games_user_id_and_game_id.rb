class AddUniqueIndexToUserGamesUserIdAndGameId < ActiveRecord::Migration[6.1]
  def change
    add_index :user_games, [:user_id, :game_id], unique: true
  end
end
