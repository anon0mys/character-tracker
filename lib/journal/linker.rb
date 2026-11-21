module Journal
  # Turns journal text into TipTap inline nodes, with @/# chips wherever it
  # names one of the campaign's characters or NPCs (exact case) or an item the
  # campaign holds (any case). Longer names win ("Halberd of Madness" over
  # "Halberd").
  #
  #   Journal::Linker.new(game, people_aliases: { "Baal" => "Ba'al" }).inline("Baal waves")
  #   # => [{ "type" => "personMention", ... "label" => "Ba'al" }, { "type" => "text", "text" => " waves" }]
  class Linker
    # aliases: other spellings => the record's name. not_people: names of
    # records that are groups rather than anyone in particular; never linked.
    def initialize(game, people_aliases: {}, item_aliases: {}, not_people: [])
      @game = game
      @people_aliases = people_aliases
      @item_aliases = item_aliases
      @not_people = not_people
    end

    def inline(text)
      nodes = []
      rest = text
      while (m = name_pattern.match(rest))
        nodes << Journal::Linker.text_node(m.pre_match) unless m.pre_match.empty?
        nodes << mention_for(m[0])
        rest = m.post_match
      end
      nodes << Journal::Linker.text_node(rest) unless rest.empty?
      nodes
    end

    # The names worth knowing when reading a page: characters, NPCs, items.
    def known_names
      targets.filter_map { |written, (_, record)| written if written == record.name }.sort
    end

    def self.text_node(text)
      { "type" => "text", "text" => text }
    end

    private

    attr_reader :game

    def mention_for(written)
      node_type, record = targets.fetch(written) { targets.find { |name, _| name.casecmp?(written) }.last }
      { "type" => node_type, "attrs" => { "id" => record.id, "type" => record.class.name, "label" => record.name } }
    end

    # People match exact case; items ignore it ("the halberd").
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

    # Written name => [node type, record].
    def targets
      @targets ||= named("personMention", people_by_name, @people_aliases)
                   .merge(named("thingMention", items_by_name, @item_aliases))
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
        .reject { |person| @not_people.include?(person.name) || person.name.blank? }
        .index_by { |person| person.name.downcase }
    end

    def items_by_name
      Item.where(id: game.holdings.select(:item_id)).index_by { |item| item.name.downcase }
    end
  end
end
