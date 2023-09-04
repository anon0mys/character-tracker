class Archetypes::Warlock
  attr_reader :name, :spellcasting_ability

  def initialize
    @name = :warlock
    @spellcasting_ability = :charisma
  end
end