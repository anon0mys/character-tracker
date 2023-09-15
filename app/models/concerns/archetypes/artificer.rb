class Archetypes::Artificer < Archetypes::Archetype
  attr_reader :name, :spellcasting_ability

  def initialize
    @name = :artificer
    @spellcasting_ability = :intelligence
  end

  def caster?
    !!@spellcasting_ability
  end
end