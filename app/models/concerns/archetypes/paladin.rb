class Archetypes::Paladin
  attr_reader :name, :spellcasting_ability

  def initialize
    @name = :paladin
    @spellcasting_ability = :charisma
  end
end