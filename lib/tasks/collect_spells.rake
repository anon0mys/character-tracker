require 'csv'

desc 'Create a json file of spell data'
task :collect_spells do
  require 'spell_parser'
  require 'requestable'

  spells_file = File.open(Rails.root.join('lib', 'seeds', 'spell_data.json'), 'w')

  response = Faraday.get('http://dnd5e.wikidot.com/spells')
  raw_spell_data = Nokogiri::HTML(response.body)
    .css("table.wiki-content-table")
    .css('tr')
    .drop(1)

  data = raw_spell_data.map do |row|
    spell = SpellParser.from_raw_data(row.text.lstrip.split("\n"))
    next if spell.name == 'Spell Name'
    
    extra_data = Faraday.get("http://dnd5e.wikidot.com/spell:#{spell.slug}")
    if extra_data.status > 400
      extra_data = Faraday.get("http://dnd5e.wikidot.com/spell:#{spell.slug(no_suffix: true)}")
    end
    if extra_data.status > 400
      extra_data = Faraday.get("http://dnd5e.wikidot.com/spell:#{spell.slug(no_apostraphe: true)}")
    end
    spell_doc = Nokogiri::HTML(extra_data.body)
    spell.add_details(spell_doc.css('div#page-content').css('p').map(&:text))
    spells_file.puts spell.to_json
  end
end