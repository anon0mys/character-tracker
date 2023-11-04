class Archetypes::Fighter < Archetypes::Archetype
  attr_reader :name

  def initialize
    @name = :fighter
    @hit_die = 'd10'
  end
end
