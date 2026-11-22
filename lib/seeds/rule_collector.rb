module Seeds
  # Builds lib/seeds/rule_data.json, the compendium's Rules, from the System
  # Reference Document 5.1 (Wizards of the Coast, CC-BY-4.0) as published in
  # JSON by the open 5e-database project (https://github.com/5e-bits/5e-database).
  class RuleCollector
    BASE = "https://raw.githubusercontent.com/5e-bits/5e-database/main/src/2014/en".freeze
    SOURCE = "SRD 5.1".freeze
    # Our own quick-reference entries, slotted in after the SRD section they
    # expand on. Not SRD text, so they carry their own source.
    TABLE_AIDS = {
      "movement-and-position" => {
        category: "Combat",
        name: "Creature Sizes",
        slug: "creature-sizes",
        source: "Table aid",
        body: <<~MD,
          How much of the battle map each size takes up. A creature's space is the area it controls in combat, not its actual body size.

          | Size | Space | Squares (5 ft.) | Hexes (5 ft.) | Examples |
          |---|---|---|---|---|
          | Tiny | 2.5 by 2.5 ft. | 1/4 square (4 per square) | 4 per hex | Imp, sprite, cat, badger, quasit |
          | Small | 5 by 5 ft. | 1 | 1 | Giant rat, goblin, almiraj, cockatrice |
          | Medium | 5 by 5 ft. | 1 | 1 | Orc, mind flayer, human, elf, blink dog |
          | Large | 10 by 10 ft. | 4 (2 × 2) | 3 | Aboleth, ogre, ankheg, beholder |
          | Huge | 15 by 15 ft. | 9 (3 × 3) | 7 (a hex and the ring around it) | Fire giant, treant, hydra, remorhaz |
          | Gargantuan | 20 by 20 ft. or larger | 16 (4 × 4) or more | 12 or more | Kraken, ancient dragon, purple worm |

          Hex counts follow the optional hex-grid rule in the Dungeon Master's Guide.

          ***Squeezing.*** A creature can squeeze through a space one size smaller than itself (a Large creature through a 5-foot-wide passage). While squeezing, each foot of movement costs 1 extra foot, and it has disadvantage on attack rolls and Dexterity saving throws; attacks against it have advantage.
        MD
      },
    }.freeze
    TIGHT = /\A\s*(- |\|)/

    def self.call = new.call

    def call
      @rules = []
      collect
      Seeds::RuleSeeder::FILE.open("w") do |file|
        @rules.each_with_index { |rule, position| file.puts({ source: SOURCE, **rule, position: }.to_json) }
      end
      @rules.size
    end

    private

    # Reading order: how checks work, then combat, adventuring, magic, gear.
    def collect
      sections("Using Ability Scores")
      abilities
      skills
      sections("Combat")
      conditions
      sections("Adventuring")
      sections("Spellcasting")
      fetch("Magic-Schools").each { |s| add("Schools of Magic", s["name"], "school-#{s['index']}", s["desc"]) }
      sections("Equipment")
      simple("Weapon Properties", "Weapon-Properties", "weapon-property")
      simple("Damage Types", "Damage-Types", "damage")
      sections("Appendix")
    end

    def fetch(name)
      @fetched ||= {}
      @fetched[name] ||= JSON.parse(Faraday.get("#{BASE}/5e-SRD-#{name}.json").body)
    end

    def add(category, name, slug, body)
      @rules << { category:, name:, slug:, body: body.strip }
    end

    # A rules chapter: one rule per section, minus the section's own heading.
    def sections(chapter)
      by_index = fetch("Rule-Sections").index_by { |section| section["index"] }
      fetch("Rules").find { |rule| rule["name"] == chapter }["subsections"].each do |sub|
        section = by_index.fetch(sub["index"])
        add(chapter, section["name"], section["index"], section["desc"].sub(/\A##[^\n]*\n+/, ""))
        aid = TABLE_AIDS[section["index"]]
        @rules << aid.merge(body: aid[:body].strip) if aid
      end
    end

    def abilities
      fetch("Ability-Scores").each do |ability|
        skills = ability["skills"].pluck("name")
        body = join(ability["desc"])
        body += "\n\n**Skills:** #{skills.join(', ')}" if skills.any?
        add("Ability Scores", ability["full_name"], "ability-#{ability['index']}", body)
      end
    end

    def skills
      names = fetch("Ability-Scores").to_h { |ability| [ability["index"], ability["full_name"]] }
      fetch("Skills").each do |skill|
        ability = names[skill.dig("ability_score", "index")]
        add("Skills", skill["name"], "skill-#{skill['index']}", "*#{ability} skill.*\n\n#{join(skill['desc'])}")
      end
    end

    # Exhaustion's levels arrive as "1 - Disadvantage..." lines; they become a table.
    def conditions
      fetch("Conditions").each do |condition|
        lines = condition["desc"].flat_map do |line|
          m = line.match(/\A(\d) - (.+)\z/)
          next line unless m

          header = m[1] == "1" ? ["| Level | Effect |", "|---|---|"] : []
          [*header, "| #{m[1]} | #{m[2]} |"]
        end
        add("Conditions", condition["name"], "condition-#{condition['index']}", join(lines))
      end
    end

    def simple(category, file, prefix)
      fetch(file).each { |record| add(category, record["name"], "#{prefix}-#{record['index']}", join(record["desc"])) }
    end

    # Bullets and table rows stay on consecutive lines; anything else is a paragraph.
    def join(lines)
      lines = Array(lines)
      lines.each_with_index.map do |line, i|
        next line if i.zero?

        separator = line.match?(TIGHT) && lines[i - 1].match?(TIGHT) ? "\n" : "\n\n"
        separator + line
      end.join
    end
  end
end
