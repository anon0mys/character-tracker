class DedupeSpellsAndAddUniqueName < ActiveRecord::Migration[6.1]
  def up
    # Point every spell_list_item at the earliest spell sharing its name...
    execute <<~SQL.squish
      UPDATE spell_list_items sli
      SET spell_id = keep.min_id
      FROM spells s
      JOIN (SELECT name, MIN(id) AS min_id FROM spells GROUP BY name) keep
        ON keep.name = s.name
      WHERE sli.spell_id = s.id AND s.id <> keep.min_id;
    SQL

    # ...then drop the duplicate spell rows.
    execute <<~SQL.squish
      DELETE FROM spells s
      USING (SELECT name, MIN(id) AS min_id FROM spells GROUP BY name) keep
      WHERE s.name = keep.name AND s.id <> keep.min_id;
    SQL

    add_index :spells, :name, unique: true
  end

  def down
    remove_index :spells, :name
  end
end
