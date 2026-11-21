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
    HEADING = /\A### (.+)\z/
    LIST_ITEM = /\A( *)(-|\d+\.) (.+)\z/

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
      { "type" => "doc", "content" => blocks(entry.lines) }
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

    # Lines into TipTap blocks: headings, paragraphs and (nested) lists.
    def blocks(lines)
      out = []
      items = []
      flush = -> { out.concat(lists(items)) && items.clear }
      lines.each do |line|
        if (m = line.match(LIST_ITEM))
          items << list_item(m, items.last)
          next
        end

        flush.call
        if (m = line.match(HEADING))
          out << { "type" => "heading", "attrs" => { "level" => 3 }, "content" => [text_node(m[1])] }
        elsif line.present?
          out << paragraph(line.strip)
        end
      end
      flush.call
      out
    end

    # Consecutive list items into lists; a deeper item nests in the one above.
    # At most one level deeper than the item above, so every nested list has
    # an item to sit in.
    def list_item(match, above)
      depth = [match[1].size / 2, (above ? above[:depth] + 1 : 0)].min
      { depth:, ordered: match[2] != "-", text: match[3] }
    end

    # Consumes items from the front.
    def lists(items, depth = 0)
      out = []
      out << list(items, depth, items.first[:ordered]) while items.first && items.first[:depth] >= depth
      out
    end

    # One list at this depth: its items, plus any deeper ones nested in them,
    # until the depth drops or bullets switch to numbers (or back).
    def list(items, depth, ordered)
      list_items = []
      while (item = items.first) && item[:depth] >= depth && (item[:depth] > depth || item[:ordered] == ordered)
        if item[:depth] > depth
          list_items.last["content"].concat(lists(items, depth + 1))
        else
          list_items << { "type" => "listItem", "content" => [paragraph(items.shift[:text])] }
        end
      end
      { "type" => ordered ? "orderedList" : "bulletList", "content" => list_items }
    end

    def paragraph(text)
      { "type" => "paragraph", "content" => inline(text) }
    end

    def text_node(text)
      { "type" => "text", "text" => text }
    end

    # --- chips ---

    # Splits text into text nodes and mention nodes at every known name.
    def inline(text)
      nodes = []
      rest = text
      while (m = name_pattern.match(rest))
        nodes << text_node(m.pre_match) unless m.pre_match.empty?
        nodes << mention_for(m[0])
        rest = m.post_match
      end
      nodes << text_node(rest) unless rest.empty?
      nodes
    end

    def mention_for(written)
      node_type, record = targets.fetch(written) { targets.find { |name, _| name.casecmp?(written) }.last }
      type = record.class.name
      { "type" => node_type, "attrs" => { "id" => record.id, "type" => type, "label" => record.name } }
    end

    # Longest names first so "Halberd of Madness" wins over "Halberd". People
    # match exact case; items ignore it ("the halberd").
    def name_pattern
      @name_pattern ||= begin
        people, items = targets.keys.partition { |name| targets[name].first == "personMention" }
        alternation = lambda do |names|
          names.sort_by { |n| -n.size }.map { |n| Regexp.escape(n) }.join("|")
        end
        parts = []
        parts << "(?-i:#{alternation.call(people)})" if people.any?
        parts << alternation.call(items) if items.any?
        parts.empty? ? /(?!)/ : /(?<![\w'])(?:#{parts.join('|')})(?![\w])/i
      end
    end

    # Written name => [node type, record], for everyone and everything in this campaign.
    def targets
      @targets ||= named("personMention", people_by_name, PEOPLE_ALIASES)
                   .merge(named("thingMention", items_by_name, ITEM_ALIASES))
    end

    # Each record under its own name and under every alias that points at it.
    def named(node_type, records, aliases)
      found = records.values.to_h { |record| [record.name, [node_type, record]] }
      aliases.each do |written, name|
        record = records[name.downcase]
        found[written] = [node_type, record] if record
      end
      found
    end

    def people_by_name
      (game.characters.to_a + game.npcs.to_a)
        .reject { |person| NOT_PEOPLE.include?(person.name) }
        .index_by { |person| person.name.downcase }
    end

    def items_by_name
      Item.where(id: game.holdings.select(:item_id)).index_by { |item| item.name.downcase }
    end
  end
end
