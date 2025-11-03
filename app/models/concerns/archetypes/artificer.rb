module Archetypes
  class Artificer < Archetypes::Archetype
    def initialize
      @name = :artificer
      @spellcasting_ability = :intelligence
      @hit_die = "d8"
    end
  end
end
