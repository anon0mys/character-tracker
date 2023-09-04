class Archetypes::Cleric
  attr_reader :name, :spellcasting_ability

  def initialize
    @name = :cleric
    @spellcasting_ability = :wisdom
  end
end