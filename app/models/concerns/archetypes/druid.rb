class Archetypes::Druid < Archetypes::Archetype
  attr_reader :name, :spellcasting_ability

  def initialize
    @name = :druid
    @spellcasting_ability = :wisdom
    @hit_die = 'd8'
  end
end
