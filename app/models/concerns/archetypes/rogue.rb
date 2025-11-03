module Archetypes
  class Rogue < Archetypes::Archetype
    def initialize
      @name = :rogue
      @spellcasting_ability = nil
      @hit_die = "d8"
    end
  end
end
