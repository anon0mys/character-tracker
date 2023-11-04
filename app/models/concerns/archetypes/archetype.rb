class Archetypes::Archetype
  attr_reader :name, :hit_die, :spellcasting_ability

  def caster?
    !!@spellcasting_ability
  end
end
