class CreateUserGames < ActiveRecord::Migration[6.1]
  def change
    create_table :user_games do |t|
      t.string :role, null: false, default: 'player'
      t.string :status, null: false, default: 'active'
      t.references :user
      t.references :game
      t.datetime :joined

      t.timestamps
    end
  end
end
