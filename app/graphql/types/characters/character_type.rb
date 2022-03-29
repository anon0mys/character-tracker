class Types::Characters::CharacterType < Types::BaseObject
  field :name, String, null: false
  field :archetype, String, null: false
  field :level, String, null: false
end