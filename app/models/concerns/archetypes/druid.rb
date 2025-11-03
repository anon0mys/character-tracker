module Archetypes
  class Druid < Archetypes::Archetype
    def initialize
      @name = :druid
      @spellcasting_ability = :wisdom
      @hit_die = "d8"
    end
  end
end
