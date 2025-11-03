module Archetypes
  class Sorcerer < Archetypes::Archetype
    def initialize
      @name = :sorcerer
      @spellcasting_ability = :charisma
      @hit_die = "d6"
    end
  end
end
