module Archetypes
  class Bard < Archetypes::Archetype
    def initialize
      @name = :bard
      @spellcasting_ability = :charisma
      @hit_die = "d8"
    end
  end
end
