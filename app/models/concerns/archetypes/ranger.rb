class Archetypes::Ranger < Archetypes::Archetype
  def initialize
    @name = :ranger
    @spellcasting_ability = :wisdom
    @hit_die = 'd10'
  end
end
