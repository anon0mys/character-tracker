class ScopeNpcsAndLocationsToGames < ActiveRecord::Migration[6.1]
  def up
    add_reference :npcs, :game, foreign_key: true
    add_reference :locations, :game, foreign_key: true

    change_column_default :npcs, :archetype, from: "artificer", to: nil
    change_column_null :npcs, :archetype, true

    remove_index :npcs, :location_id
    add_index :npcs, :location_id
  end

  def down
    remove_index :npcs, :location_id
    add_index :npcs, :location_id, unique: true

    execute "UPDATE npcs SET archetype = 'artificer' WHERE archetype IS NULL"
    change_column_null :npcs, :archetype, false
    change_column_default :npcs, :archetype, from: nil, to: "artificer"

    remove_reference :locations, :game, foreign_key: true
    remove_reference :npcs, :game, foreign_key: true
  end
end
