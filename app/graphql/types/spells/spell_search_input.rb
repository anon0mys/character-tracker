class Types::Spells::SpellSearchInput < Types::BaseInputObject
  description "Attributes for searching for spells"
  argument :name, String, "Fuzzy match for name of the spell", required: false
  argument :archetype, [String], "List of archetypes to include", required: false
  argument :level, [String], "List of levels to include", required: false
end
