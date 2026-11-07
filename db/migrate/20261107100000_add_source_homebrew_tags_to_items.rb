class AddSourceHomebrewTagsToItems < ActiveRecord::Migration[6.1]
  def up
    change_table :items, bulk: true do |t|
      t.string :source
      t.boolean :homebrew, default: false, null: false
      t.string :tags, array: true, default: [], null: false
      t.index :homebrew
    end

    # Published items carry their book at the front of the scraped description.
    execute <<~SQL.squish
      UPDATE items
      SET source = substring(description from '^Source: (.+?) (?:Wondrous item|Wondrous Item|Weapon|Armor|Ring|Rod|Staff|Wand|Potion|Scroll|Ammunition|Shield)')
      WHERE description LIKE 'Source: %'
    SQL
  end

  def down
    change_table :items, bulk: true do |t|
      t.remove_index :homebrew
      t.remove :tags, :homebrew, :source
    end
  end
end
