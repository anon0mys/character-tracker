module Archetypes
  ALL = {
    artificer: Artificer
  }

  def self.build(name)
    ALL[name].new
  end

  def self.names
    ALL.keys
  end
end