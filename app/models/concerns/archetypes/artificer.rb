class Archetypes::Artificer
  attr_reader :name, :spellcasting_ability

  def initialize
    @name = :artificer
    @spellcasting_ability = :intelligence
  end
end