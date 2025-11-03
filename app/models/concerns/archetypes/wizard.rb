class Archetypes::Wizard < Archetypes::Archetype
  def initialize
    @name = :wizard
    @spellcasting_ability = :intelligence
    @hit_die = 'd6'
  end
end
