class CreateJournalMentions < ActiveRecord::Migration[6.1]
  def change
    create_table :journal_mentions do |t|
      t.references :journal_entry, null: false, foreign_key: { on_delete: :cascade }
      t.references :mentionable, null: false, polymorphic: true
      t.string :label, null: false
      t.text :excerpt
      t.timestamps
    end
    add_index :journal_mentions, %i[journal_entry_id mentionable_type mentionable_id], unique: true,
      name: "index_journal_mentions_on_entry_and_mentionable"
  end
end
