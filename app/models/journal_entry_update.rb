class JournalEntryUpdate < ApplicationRecord
  belongs_to :journal_entry

  validates :seq, presence: true, uniqueness: { scope: :journal_entry_id }
  validates :payload, presence: true
end
