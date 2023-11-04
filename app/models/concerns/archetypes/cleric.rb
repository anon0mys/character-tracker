class Archetypes::Cleric < Archetypes::Archetype
  attr_reader :name, :spellcasting_ability

  def initialize
    @name = :cleric
    @spellcasting_ability = :wisdom
    @hit_die = 'd8'
  end
end
