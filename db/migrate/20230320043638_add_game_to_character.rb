class AddGameToCharacter < ActiveRecord::Migration[6.1]
  def change
    add_reference :characters, :game, foreign_key: true
  end
end
