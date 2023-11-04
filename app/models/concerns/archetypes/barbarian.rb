class Archetypes::Barbarian < Archetypes::Archetype
  attr_reader :name

  def initialize
    @name = :barbarian
    @hit_die = 'd12'
  end
end
