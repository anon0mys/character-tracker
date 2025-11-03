module Archetypes
  class Fighter < Archetypes::Archetype
    def initialize
      @name = :fighter
      @spellcasting_ability = nil
      @hit_die = "d10"
    end
  end
end
