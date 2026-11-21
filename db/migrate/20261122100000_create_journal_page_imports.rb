# Photographed notebook pages on their way into a campaign's journal: the
# photos, then the entries Claude transcribed from them for review.
class CreateJournalPageImports < ActiveRecord::Migration[6.1]
  def change
    create_table :journal_page_imports do |t|
      t.references :game, null: false, foreign_key: true
      t.references :created_by, null: false, foreign_key: { to_table: :users }
      t.string :status, null: false, default: "transcribing"
      t.integer :page_count, null: false, default: 0
      t.jsonb :entries, null: false, default: []
      t.text :error
      t.timestamps
    end

    # The photos themselves, until the import is confirmed or discarded.
    create_table :journal_page_import_pages do |t|
      t.references :journal_page_import, null: false, foreign_key: true
      t.integer :position, null: false
      t.string :content_type, null: false
      t.binary :data, null: false
      t.timestamps
    end
  end
end
