# Has Claude read a JournalPageImport's photos into draft entries. Runs in the
# background because reading several pages takes longer than a web request may
# (Heroku cuts those off at 30 seconds). Leaves the import ready for review, or
# failed with a message the person sees next to a Retry button.
class TranscribeJournalPagesJob < ApplicationJob
  queue_as :default

  def perform(import_id)
    import = JournalPageImport.find_by(id: import_id)
    return unless import&.transcribing?

    entries = JournalPageTranscriber.call(
      pages: import.pages.to_a,
      known_names: Journal::Linker.new(import.game).known_names,
      latest_played_on: import.game.journal_entries.maximum(:played_on),
    )
    import.update!(entries:, status: "ready", error: nil)
  rescue JournalPageTranscriber::Error => e
    import&.update!(status: "failed", error: e.message)
  rescue StandardError => e
    Rails.logger.error("TranscribeJournalPagesJob #{import_id}: #{e.class} #{e.message}")
    import&.update!(status: "failed", error: "Something went wrong reading the pages. Try again.")
  end
end
