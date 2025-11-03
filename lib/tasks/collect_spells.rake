require "csv"

desc "Create a json file of spell data"
task collect_spells: :environment do
  require "spell_parser"
  require "requestable"

  spells_file = Rails.root.join("lib/seeds/spell_data.json").open("w")

  response = Faraday.get("http://dnd5e.wikidot.com/spells")
  raw_spell_data = Nokogiri::HTML(response.body)
                           .css("table.wiki-content-table")
                           .css("tr")
                           .drop(1)

  raw_spell_data.map do |row|
    spell = SpellParser.from_raw_data(row.text.lstrip.split("\n"))
    next if spell.name == "Spell Name"

    extra_data = Faraday.get("http://dnd5e.wikidot.com/spell:#{spell.slug}")
    extra_data = Faraday.get("http://dnd5e.wikidot.com/spell:#{spell.slug(no_suffix: true)}") if extra_data.status > 400
    if extra_data.status > 400
      extra_data = Faraday.get("http://dnd5e.wikidot.com/spell:#{spell.slug(no_apostraphe: true)}")
    end
    spell_doc = Nokogiri::HTML(extra_data.body)
    spell.add_details(spell_doc.css("div#page-content").css("p").map(&:text))
    spells_file.puts spell.to_json
  end
end
