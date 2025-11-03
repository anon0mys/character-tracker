module Types
  module Spells
    class SpellType < Types::BaseObject
      field :name, String, null: false
      field :description, String
      field :archetypes, [String]
      field :level, String
      field :school, String
      field :casting_time, String
      field :range, String
      field :duration, String
      field :components, [String]
    end
  end
end
