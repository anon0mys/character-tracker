# Links that let someone join a campaign as a player or its DM.
class CreateGameInvites < ActiveRecord::Migration[6.1]
  def change
    create_table :game_invites do |t|
      t.references :game, null: false, foreign_key: true
      t.references :created_by, null: false, foreign_key: { to_table: :users }
      t.string :token, null: false
      t.string :role, null: false, default: "player"
      t.integer :max_uses
      t.integer :uses_count, null: false, default: 0
      t.datetime :expires_at, null: false
      t.datetime :revoked_at
      t.timestamps
    end
    add_index :game_invites, :token, unique: true
  end
end
