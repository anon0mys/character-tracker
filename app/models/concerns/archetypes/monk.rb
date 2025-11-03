class Archetypes::Monk < Archetypes::Archetype
  def initialize
    @name = :monk
    @spellcasting_ability = nil
    @hit_die = 'd8'
  end
end
