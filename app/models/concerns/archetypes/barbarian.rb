class Archetypes::Barbarian < Archetypes::Archetype
  attr_reader :name

  def initialize
    @name = :barbarian
  end
end