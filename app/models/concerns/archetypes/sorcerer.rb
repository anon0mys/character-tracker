class Archetypes::Sorcerer < Archetypes::Archetype
  attr_reader :name, :spellcasting_ability

  def initialize
    @name = :sorcerer
    @spellcasting_ability = :charisma
    @hit_die = 'd6'
  end
end
