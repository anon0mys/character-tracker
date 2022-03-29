class Types::Spells::SpellSearchInput < Types::BaseInputObject
  description "Attributes for searching for spells"
  argument :name, String, "Fuzzy match for name of the spell", required: false
end
