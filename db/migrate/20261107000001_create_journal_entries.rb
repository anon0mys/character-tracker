class CreateJournalEntries < ActiveRecord::Migration[6.1]
  def change
    create_table :journal_entries do |t|
      t.references :game, null: false, foreign_key: true
      t.integer :number, null: false
      t.date :played_on, null: false
      t.string :title
      t.jsonb :body, null: false, default: {}
      t.binary :ydoc_state
      t.integer :update_seq, null: false, default: 0
      t.integer :compacted_through, null: false, default: 0
      t.timestamps
    end
    add_index :journal_entries, %i[game_id number], unique: true
  end
end
