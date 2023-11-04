class Archetypes::Rogue < Archetypes::Archetype
  attr_reader :name

  def initialize
    @name = :rogue
    @hit_die = 'd8'
  end
end
