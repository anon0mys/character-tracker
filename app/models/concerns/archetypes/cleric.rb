class Archetypes::Cleric < Archetypes::Archetype
  attr_reader :name, :spellcasting_ability

  def initialize
    @name = :cleric
    @spellcasting_ability = :wisdom
  end
end