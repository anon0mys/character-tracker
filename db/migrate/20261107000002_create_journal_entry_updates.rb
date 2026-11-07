class CreateJournalEntryUpdates < ActiveRecord::Migration[6.1]
  def change
    create_table :journal_entry_updates do |t|
      t.references :journal_entry, null: false, foreign_key: { on_delete: :cascade }
      t.integer :seq, null: false
      t.binary :payload, null: false
      t.timestamps
    end
    add_index :journal_entry_updates, %i[journal_entry_id seq], unique: true
  end
end
