# Full-text search over journal entries: the body's plain text, and a GIN index
# on the tsvector JournalSearch queries (title weighted above text). An
# expression index rather than a generated column, which Rails 6.1 can't dump
# to schema.rb.
class AddSearchToJournalEntries < ActiveRecord::Migration[6.1]
  # Must stay identical to JournalSearch::VECTOR or queries skip the index.
  VECTOR = "(setweight(to_tsvector('english'::regconfig, COALESCE((title)::text, ''::text)), 'A'::\"char\") || " \
           "setweight(to_tsvector('english'::regconfig, search_text), 'B'::\"char\"))".freeze

  # A bare model so later changes to JournalEntry can't break this migration.
  class Entry < ActiveRecord::Base
    self.table_name = "journal_entries"
  end

  def up
    add_column :journal_entries, :search_text, :text, null: false, default: ""
    add_index :journal_entries, VECTOR, using: :gin, name: "index_journal_entries_on_search"

    Entry.reset_column_information
    Entry.find_each { |entry| entry.update_columns(search_text: JournalText.call(entry.body)) }
  end

  def down
    remove_index :journal_entries, name: "index_journal_entries_on_search"
    remove_column :journal_entries, :search_text
  end
end
