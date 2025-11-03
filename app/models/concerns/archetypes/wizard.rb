module Archetypes
  class Wizard < Archetypes::Archetype
    def initialize
      @name = :wizard
      @spellcasting_ability = :intelligence
      @hit_die = "d6"
    end
  end
end
