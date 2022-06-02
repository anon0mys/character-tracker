class Types::Characters::CharacterInput < Types::BaseInputObject
  description "Attributes for searching for spells"
  argument :id, ID, "The id of the character you are changing", required: false
  argument :name, String, "The name of the character", required: true
  argument :archetype, Types::Characters::Archetypes, "The class of the character", required: true
end