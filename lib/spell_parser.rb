class SpellParser
  HEADERS = %i[name school casting_time range duration components]
  ARCHETYPES = %w[artificer barbarian bard cleric druid fighter monk paladin ranger rogue sorcerer warlock wizard]

  def initialize(data)
    @data = data
  end

  def name
    @data[:name]
  end

  def to_json
    @data.to_json
  end

  def slug(no_suffix: false, no_apostraphe: false)
    name = @data[:name]
    if no_suffix
      name, _ = name.split(' (')
    end
    if no_apostraphe
      name = name.gsub("'", '')
    end
    name.parameterize
  end

  def add_details(details)
    add_description(details)
    add_archetypes(details)
    add_level(details)
  end

  def add_description(details)
    @data[:description] = details[3..-1].reject do |detail|
      detail.downcase.include?('spell lists')
    end.join(' ')
  end

  def add_archetypes(details)
    data = details[-3..-1].find {|detail| detail.downcase.include?('spell lists') }
    data = data.gsub(':', '.')
    _, archetypes = data.split('. ')
    @data[:archetypes] = archetypes.split(',').map do |archetype|
      archetype, _ = archetype.downcase.strip.split(' ')
      archetype.to_sym
    end
  end

  def test
    puts "something cool"
  end

  def add_level(details)
    spell_info = details[1]
    if spell_info.include?('cantrip')
      @data[:level] = 'cantrip'
    else
      @data[:level] = spell_info[0]
    end
  end

  def self.from_raw_data(row)
    row_hash = HEADERS.zip(row).to_h
    school, _ = row_hash[:school].downcase.split(' ')
    row_hash[:school] = school
    row_hash[:components] = row_hash[:components].split(',').map(&:strip)
    self.new(row_hash)
  end
end