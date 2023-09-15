class Archetypes::Archetype
  def caster?
    !!@spellcasting_ability
  end
end