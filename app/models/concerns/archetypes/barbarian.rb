class Archetypes::Barbarian < Archetypes::Archetype
  def initialize
    @name = :barbarian
    @spellcasting_ability = nil
    @hit_die = 'd12'
  end
end
