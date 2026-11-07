module RaceWars
  # Loads the party's Notion "Equipment" table (snapshot in equipment.json) into
  # one campaign: the players, their characters, the NPCs and places that hold
  # things, the homebrew items, and a holding per copy.
  #
  # Re-runnable: people, places and items are matched by name. Holdings are only
  # written into a campaign that has none, unless replace: true.
  class Import
    SNAPSHOT = Rails.root.join("lib/race_wars/equipment.json")
    SOURCE = "Race Wars".freeze
    CONTAINER = "Bag of Holding".freeze
    CONTAINER_OWNER = "Baal".freeze

    PLAYERS = {
      "Baal" => { name: "Ba'al", archetype: "bard", subclass: "Lore", background: "Entertainer" },
      "Naal" => { name: "Na'al", archetype: "sorcerer", subclass: nil, background: "Unknown" },
      "Pov" => { name: "Pov", archetype: "druid", subclass: "Spores", background: "Folk Hero" },
      "Rist" => { name: "Rist", archetype: "rogue", subclass: "Swashbuckler", background: "Criminal" },
    }.freeze
    EXISTING_CHARACTERS = %w[Kai].freeze
    NPCS = {
      "Bothane" => { archetype: "paladin", description: "Prior player character turned NPC. Gatewatcher Paladin." },
      "Oni" => { archetype: "monk", description: "Prior player character turned NPC." },
    }.freeze
    OTHER_NPCS = ["Terrafax", "Kerris", "Razael", "Ashawn", "Father Papyrus", "The triplets", "Humans", "Steve"].freeze
    PLACES = ["Home Base", "Bank Vault"].freeze
    GONE = { "Sold" => "sold", "Lost" => "lost", "Destroyed" => "destroyed" }.freeze
    # Notion holders that are not anyone in particular; their copies come in not placed.
    UNPLACED = %w[Us].freeze

    SRD_ALIASES = {
      "Boots of Springing and Striding" => "Boots of Striding and Springing",
      "Ring of Telekenisis" => "Ring of Telekinesis",
    }.freeze

    # Most specific first: the first match is the item_type, the rest become tags.
    TYPE_MAP = [
      ["Armor", "armor", []],
      ["Magic Weapon", "weapon", ["magic item"]],
      ["Weapon", "weapon", []],
      ["Potion", "potion", []],
      ["Scroll", "scroll", []],
      ["Accessory", "jewelry", []],
      ["Magic Book", "gear", ["book", "magic item"]],
      ["Book", "gear", ["book"]],
      ["Loot", "gear", ["loot"]],
      ["Bag", "wondrous", ["bag"]],
      ["Magic Gadget", "wondrous", ["gadget"]],
      ["Magic Object", "wondrous", ["object"]],
      ["Magic Item", "wondrous", ["magic item"]],
    ].freeze
    TAG_ONLY = { "Unique" => "unique", "Game Item" => "game item" }.freeze

    def initialize(game:, replace: false, log: $stdout)
      @game = game
      @replace = replace
      @log = log
    end

    def call
      ActiveRecord::Base.transaction do
        holders = people_and_places
        if skip_holdings?
          log.puts("#{game.name} already has holdings; pass REPLACE=1 to rebuild them")
        else
          game.holdings.destroy_all
          import_holdings(holders)
        end
      end
    end

    private

    attr_reader :game, :log

    def rows
      @rows ||= JSON.parse(SNAPSHOT.read)
    end

    def skip_holdings?
      !@replace && game.holdings.exists?
    end

    def people_and_places
      holders = {}
      PLAYERS.each { |key, attrs| holders[key] = player_character(attrs) }
      EXISTING_CHARACTERS.each { |name| holders[name] = existing_character(name) }
      NPCS.each { |name, attrs| holders[name] = npc(name, attrs) }
      OTHER_NPCS.each { |name| holders[name] = npc(name, {}) }
      PLACES.each { |name| holders[name] = game.locations.find_or_create_by!(name:) }
      holders
    end

    def player_character(attrs)
      user = player(attrs[:name])
      game.user_games.find_or_create_by!(user:) do |membership|
        membership.assign_attributes(role: "player", status: "active")
      end
      game.characters.find_or_create_by!(name: attrs[:name]) do |character|
        character.assign_attributes(
          user:, level: 15, archetype: attrs[:archetype], subclass: attrs[:subclass],
          background: attrs[:background], race: "Unknown", alignment: "UN", age: 0
        )
      end
    end

    # Placeholder email; the player sets a real one and a password later.
    def player(username)
      User.where("lower(username) = ?", username.downcase).first ||
        User.create!(username:, email: "#{username.downcase.gsub(/[^a-z0-9]/, '')}@race-wars.invalid",
          password: SecureRandom.base58(24))
    end

    def existing_character(name)
      character = game.characters.find_by(name:)
      log.puts("No #{name} in #{game.name}; their holdings come in not placed") unless character
      character
    end

    def npc(name, attrs)
      game.npcs.find_or_create_by!(name:) { |record| record.assign_attributes(attrs) }
    end

    def import_holdings(holders)
      bag = container(holders)
      rows.each do |row|
        next if row["name"] == CONTAINER

        item = item_for(row)
        copies_per_holder(row).each do |where, quantity|
          create_holding(row, item, where, quantity, holders.merge(CONTAINER => bag))
        end
      end
      log.puts("Imported #{game.holdings.count} holdings into #{game.name}")
    end

    def container(holders)
      row = rows.find { |r| r["name"] == CONTAINER }
      game.holdings.create!(item: item_for(row), holder: holders[CONTAINER_OWNER], quantity: 1, status: "carried")
    end

    # A row held by several people splits its count evenly between them.
    def copies_per_holder(row)
      where = row["where"].presence || [nil]
      count = row["count"].nil? ? 1 : row["count"]
      where.map { |w| [w, where.size > 1 ? count / where.size : count] }
    end

    def create_holding(row, item, where, quantity, holders)
      holder = UNPLACED.include?(where) ? nil : holders[where]
      game.holdings.create!(
        item:, holder:, quantity:,
        status: status_for(where, holder),
        notes: notes_for(row, item)
      )
    end

    def status_for(where, holder)
      return GONE[where] if GONE.key?(where)
      return "stored" if holder.is_a?(Location) || holder.is_a?(Holding)

      "carried"
    end

    # The table's own words, when the item's compendium text is someone else's.
    def notes_for(row, item)
      text = row["description"].presence
      text unless text.nil? || text == item.description
    end

    def item_for(row)
      srd_item(row["name"]) || homebrew_item(row)
    end

    def srd_item(name)
      Item.where(homebrew: false).where("lower(name) = ?", SRD_ALIASES.fetch(name, name).downcase).first
    end

    def homebrew_item(row)
      Item.where("lower(name) = ?", row["name"].downcase).first ||
        Item.create!(homebrew_attributes(row))
    end

    def homebrew_attributes(row)
      types = row["types"]
      matches = TYPE_MAP.select { |label, _, _| types.include?(label) }
      {
        name: row["name"], description: row["description"], source: SOURCE, homebrew: true,
        item_type: matches.first&.second || "gear",
        tags: (matches.flat_map(&:third) + types.filter_map { |t| TAG_ONLY[t] }).uniq,
        quality: types.include?("Legendary") ? "legendary" : nil,
        total_charges: row["charges"]
      }
    end
  end
end
