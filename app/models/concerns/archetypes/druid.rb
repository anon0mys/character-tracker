class Archetypes::Druid
  attr_reader :name, :spellcasting_ability

  def initialize
    @name = :druid
    @spellcasting_ability = :wisdom
  end
end