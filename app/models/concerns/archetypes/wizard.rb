class Archetypes::Wizard < Archetypes::Archetype
  attr_reader :name, :spellcasting_ability

  def initialize
    @name = :wizard
    @spellcasting_ability = :intelligence
  end
end