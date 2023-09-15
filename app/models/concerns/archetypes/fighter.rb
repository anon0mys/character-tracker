class Archetypes::Fighter < Archetypes::Archetype
  attr_reader :name

  def initialize
    @name = :fighter
  end
end