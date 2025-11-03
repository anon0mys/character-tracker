class Archetypes::Warlock < Archetypes::Archetype
  def initialize
    @name = :warlock
    @spellcasting_ability = :charisma
    @hit_die = 'd8'
  end
end
