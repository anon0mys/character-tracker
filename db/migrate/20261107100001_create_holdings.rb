class CreateHoldings < ActiveRecord::Migration[6.1]
  def up
    create_table :holdings do |t|
      t.references :game, null: false, foreign_key: true
      t.references :item, null: false, foreign_key: true
      t.references :holder, polymorphic: true
      t.integer :quantity, default: 1, null: false
      t.string :status, default: "carried", null: false
      t.text :notes
      t.timestamps
    end

    # character_items had no status; the item-level status was the closest thing.
    execute <<~SQL.squish
      INSERT INTO holdings (game_id, item_id, holder_type, holder_id, quantity, status, created_at, updated_at)
      SELECT characters.game_id, character_items.item_id, 'Character', character_items.character_id,
             COALESCE(character_items.quantity, 1),
             CASE items.status WHEN 'equipped' THEN 'equipped' WHEN 'stored' THEN 'stored'
                               WHEN 'sold' THEN 'sold' ELSE 'carried' END,
             character_items.created_at, character_items.updated_at
      FROM character_items
      JOIN characters ON characters.id = character_items.character_id
      JOIN items ON items.id = character_items.item_id
      WHERE characters.game_id IS NOT NULL
    SQL

    drop_table :character_items
  end

  def down
    create_table :character_items do |t|
      t.bigint :character_id
      t.bigint :item_id
      t.integer :quantity
      t.timestamps
    end
    add_index :character_items, :character_id
    add_index :character_items, :item_id

    execute <<~SQL.squish
      INSERT INTO character_items (character_id, item_id, quantity, created_at, updated_at)
      SELECT holder_id, item_id, quantity, created_at, updated_at
      FROM holdings WHERE holder_type = 'Character'
    SQL

    drop_table :holdings
  end
end
