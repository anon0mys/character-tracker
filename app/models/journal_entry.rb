# One dated record in a campaign's journal. The text is a Yjs document edited
# live by everyone in the campaign: `ydoc_state` + `body` are the last client
# snapshot, and `journal_entry_updates` hold every update since it.
class JournalEntry < ApplicationRecord
  belongs_to :game
  has_many :journal_entry_updates, dependent: :delete_all
  has_many :journal_mentions, dependent: :delete_all

  before_validation :assign_number, on: :create
  before_validation :default_played_on, on: :create

  validates :number, presence: true, uniqueness: { scope: :game_id }
  validates :played_on, presence: true

  # Appends one Yjs update under a row lock so seq stays gapless per entry.
  def append_update!(payload)
    with_lock do
      next_seq = update_seq + 1
      journal_entry_updates.create!(seq: next_seq, payload:)
      update!(update_seq: next_seq)
      next_seq
    end
  end

  # Stores a client snapshot covering every update up to through_seq, drops
  # those log rows and re-syncs mentions. A snapshot older than the stored one
  # is ignored. Returns whether it was stored.
  def store_snapshot!(state:, body:, through_seq:)
    with_lock do
      covered = through_seq.to_i.clamp(0, update_seq)
      stored = covered >= compacted_through
      if stored
        update!(ydoc_state: state, body:, compacted_through: covered)
        journal_entry_updates.where("seq <= ?", covered).delete_all
        JournalMentionSync.call(self)
      end
      stored
    end
  end

  # Updates a joining client still needs on top of the snapshot.
  def pending_updates
    journal_entry_updates.where("seq > ?", compacted_through).order(:seq)
  end

  private

  def assign_number
    self.number ||= (game.journal_entries.maximum(:number) || 0) + 1 if game
  end

  def default_played_on
    self.played_on ||= Date.current
  end
end
