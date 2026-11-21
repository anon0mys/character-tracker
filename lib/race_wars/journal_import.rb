module RaceWars
  # Loads the paper session journal (transcribed in journal.md) into one
  # campaign's journal: one entry per session, with the people and items it
  # names turned into @/# chips, and the Yjs state the editor opens.
  #
  # Run the equipment import first: chips only point at the campaign's
  # characters and NPCs and the items it holds, so anything missing stays
  # plain text.
  #
  # Re-runnable: entries are matched by date and title. Existing ones are left
  # alone unless replace: true, which rewrites them from the file (and drops
  # any edits made to them in the app).
  class JournalImport
    TRANSCRIPT = Rails.root.join("lib/race_wars/journal.md")
    ENTRY = /\A## (\d{4}-\d{2}-\d{2}) \| (.+)\z/

    # Spellings in the notebook => the record's name. Everyone else is matched
    # by their own name.
    PEOPLE_ALIASES = {
      "Baal" => "Ba'al", "Bothane" => "Bothane", "Brothane" => "Bothane", "Brothan" => "Bothane",
      "Bo" => "Bothane", "Riste" => "Rist", "Pove" => "Pov", "Raznel" => "Razael"
    }.freeze
    # Names that are groups, not anyone in particular, and stay plain text.
    NOT_PEOPLE = ["Humans", "The triplets", "Us"].freeze
    ITEM_ALIASES = {
      "Venemous Walk" => "Venemous Ring", "Halberd" => "Halberd of Madness", "Scry-balls" => "Scryballs",
      "stones of sending" => "Sending Stones", "sanctuary gadget" => "Sanctuary Cube", "Gem Heart" => "Gemheart",
      "Malecitic Atlas" => "Malecetic Atlas", "Blood crystals" => "Blood Crystal", "Books of Azoth" => "Book of Azoth"
    }.freeze

    Entry = Struct.new(:played_on, :title, :lines)

    def initialize(game:, replace: false, log: $stdout, transcript: TRANSCRIPT)
      @game = game
      @replace = replace
      @log = log
      @transcript = transcript
    end

    def call
      pending = entries.filter_map { |entry| [entry, existing(entry)] if write?(entry) }
      states = Journal::Ydoc.states_for(pending.map { |entry, _| body_for(entry) })

      ActiveRecord::Base.transaction do
        pending.zip(states).each { |(entry, record), state| save(entry, record, state) }
      end
      log.puts("Wrote #{pending.size} of #{entries.size} journal entries into #{game.name}")
    end

    # TipTap JSON for one entry, chips included. Public so it can be checked
    # without a database write.
    def body_for(entry)
      markdown.doc(entry.lines)
    end

    def entries
      @entries ||= parse(File.read(@transcript))
    end

    private

    attr_reader :game, :log

    def existing(entry)
      game.journal_entries.find_by(played_on: entry.played_on, title: entry.title)
    end

    def write?(entry)
      @replace || existing(entry).nil?
    end

    def save(entry, record, state)
      body = body_for(entry)
      if record
        record.journal_entry_updates.delete_all
        record.update!(body:, ydoc_state: state, update_seq: 0, compacted_through: 0)
      else
        record = game.journal_entries.create!(played_on: entry.played_on, title: entry.title, body:, ydoc_state: state)
      end
      JournalMentionSync.call(record)
    end

    # --- journal.md ---

    def parse(text)
      text = text.gsub(/<!--.*?-->/m, "")
      text.lines(chomp: true).each_with_object([]) do |line, found|
        if (m = line.match(ENTRY))
          found << Entry.new(Date.parse(m[1]), m[2].strip, [])
        elsif found.any?
          found.last.lines << line.rstrip
        end
      end.sort_by(&:played_on)
    end

    def markdown
      @markdown ||= Journal::Markdown.new(
        Journal::Linker.new(game, people_aliases: PEOPLE_ALIASES, item_aliases: ITEM_ALIASES, not_people: NOT_PEOPLE),
      )
    end
  end
end
