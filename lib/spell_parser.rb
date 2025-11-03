class SpellParser
  HEADERS = %i[name school casting_time range duration components].freeze
  ARCHETYPES = %w[artificer barbarian bard cleric druid fighter monk paladin ranger rogue sorcerer warlock
                  wizard].freeze

  def initialize(data)
    @data = data
  end

  def name
    @data[:name]
  end

  def to_json(*_args)
    @data.to_json
  end

  def slug(no_suffix: false, no_apostraphe: false)
    name = @data[:name]
    name, = name.split(" (") if no_suffix
    name = name.gsub("'", "") if no_apostraphe
    name.parameterize
  end

  def add_details(details)
    add_description(details)
    add_archetypes(details)
    add_level(details)
  end

  def add_description(details)
    @data[:description] = details[3..].reject do |detail|
      detail.downcase.include?("spell lists")
    end.join(" ")
  end

  def add_archetypes(details)
    data = details[-3..].find { |detail| detail.downcase.include?("spell lists") }
    data = data.gsub(":", ".")
    _, archetypes = data.split(". ")
    @data[:archetypes] = archetypes.split(",").map do |archetype|
      archetype, = archetype.downcase.strip.split
      archetype.to_sym
    end
  end

  def add_level(details)
    spell_info = details[1]
    @data[:level] = if spell_info.include?("cantrip")
                      "cantrip"
                    else
                      spell_info[0]
                    end
  end

  def self.from_raw_data(row)
    row_hash = HEADERS.zip(row).to_h
    school, = row_hash[:school].downcase.split
    row_hash[:school] = school
    row_hash[:components] = row_hash[:components].split(",").map(&:strip)
    new(row_hash)
  end
end
