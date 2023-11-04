class Archetypes::Monk < Archetypes::Archetype
  attr_reader :name

  def initialize
    @name = :monk
    @hit_die = 'd8'
  end
end
