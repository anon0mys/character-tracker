class Archetypes::Cleric < Archetypes::Archetype
  def initialize
    @name = :cleric
    @spellcasting_ability = :wisdom
    @hit_die = 'd8'
  end
end
