# Photographed notebook pages becoming journal entries. Pages go in, a
# background job (TranscribeJournalPagesJob) has Claude read them into draft
# entries, the person reviews and edits the drafts, and confirming writes them
# into the campaign's journal and deletes the photos.
#
#   transcribing -> ready -> done
#        |  ^
#        v  |  (retry)
#       failed
#
# A draft entry: { "played_on" => "2022-08-06" or nil, "date_estimated" => bool,
# "title" => String, "body" => notebook text (see Journal::Markdown),
# "unreadable" => [String], "pages" => [Integer] }
class JournalPageImport < ApplicationRecord
  STATUSES = %w[transcribing ready failed done].freeze
  MAX_PAGES = 20
  ENTRY_KEYS = %w[played_on date_estimated title body unreadable pages].freeze

  class NotReady < StandardError; end

  belongs_to :game
  belongs_to :created_by, class_name: "User"
  has_many :pages, -> { order(:position) }, class_name: "JournalPageImportPage", dependent: :delete_all

  validates :status, inclusion: { in: STATUSES }

  scope :unfinished, -> { where.not(status: "done") }

  # A job that runs this long was lost (say, to a Heroku restart).
  STALLED_AFTER = 15.minutes

  STATUSES.each { |name| define_method(:"#{name}?") { status == name } }

  def stalled?
    transcribing? && updated_at < STALLED_AFTER.ago
  end

  def retryable?
    failed? || stalled?
  end

  # The status the person sees: a lost job reads as failed, so they can retry.
  def display_status
    stalled? ? "failed" : status
  end

  def display_error
    stalled? ? "Reading the pages was interrupted. Try again." : error
  end

  # Draft entries as edited in review, keeping only the known keys.
  def entries=(list)
    super(Array(list).map { |entry| entry.to_h.stringify_keys.slice(*ENTRY_KEYS) })
  end

  # Writes the drafts into the journal, oldest first, with @/# links and the
  # editor's Yjs state, then forgets the photos. Every draft needs a real date.
  # Returns the new JournalEntry records.
  def confirm!
    raise NotReady, "This import isn't ready to add yet" unless ready?

    drafts = entries.map { |entry| draft_for(entry) }.sort_by { |draft| draft[:played_on] }
    transaction do
      created = write_entries(drafts)
      pages.delete_all
      update!(status: "done")
      created
    end
  end

  private

  def write_entries(drafts)
    markdown = Journal::Markdown.new(Journal::Linker.new(game))
    bodies = drafts.map { |draft| markdown.doc(draft[:body]) }
    states = Journal::Ydoc.states_for(bodies)
    drafts.zip(bodies, states).map do |draft, body, state|
      entry = game.journal_entries.create!(played_on: draft[:played_on], title: draft[:title], body:, ydoc_state: state)
      JournalMentionSync.call(entry)
      entry
    end
  end

  def draft_for(entry)
    played_on = Date.iso8601(entry["played_on"].to_s)
    { played_on:, title: entry["title"].to_s.strip.presence, body: entry["body"].to_s }
  rescue Date::Error
    errors.add(:base, "Every entry needs a date (\"#{entry['title'].presence || 'Untitled'}\" has none)")
    raise ActiveRecord::RecordInvalid, self
  end
end
