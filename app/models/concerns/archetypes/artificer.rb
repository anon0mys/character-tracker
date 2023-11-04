class Archetypes::Artificer < Archetypes::Archetype
  attr_reader :name, :spellcasting_ability, :hit_die

  def initialize
    @name = :artificer
    @spellcasting_ability = :intelligence
    @hit_die = 'd8'
  end

  def caster?
    !!@spellcasting_ability
  end
end
