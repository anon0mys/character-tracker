module Archetypes
  class Paladin < Archetypes::Archetype
    def initialize
      @name = :paladin
      @spellcasting_ability = :charisma
      @hit_die = "d10"
    end
  end
end
