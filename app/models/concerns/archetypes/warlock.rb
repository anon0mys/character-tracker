class Archetypes::Warlock < Archetypes::Archetype
  attr_reader :name, :spellcasting_ability

  def initialize
    @name = :warlock
    @spellcasting_ability = :charisma
    @hit_die = 'd8'
  end
end
