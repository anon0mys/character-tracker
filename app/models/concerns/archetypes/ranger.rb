class Archetypes::Ranger < Archetypes::Archetype
  attr_reader :name, :spellcasting_ability

  def initialize
    @name = :ranger
    @spellcasting_ability = :wisdom
  end
end