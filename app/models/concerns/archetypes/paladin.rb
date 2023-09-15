class Archetypes::Paladin < Archetypes::Archetype
  attr_reader :name, :spellcasting_ability

  def initialize
    @name = :paladin
    @spellcasting_ability = :charisma
  end
end