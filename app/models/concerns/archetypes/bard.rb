class Archetypes::Bard
  attr_reader :name, :spellcasting_ability

  def initialize
    @name = :bard
    @spellcasting_ability = :charisma
  end
end