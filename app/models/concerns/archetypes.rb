module Archetypes
  ALL = {
    artificer: Artificer,
    barbarian: Artificer,
    bard: Artificer,
    cleric: Artificer,
    druid: Artificer,
    fighter: Artificer,
    monk: Artificer,
    paladin: Artificer,
    ranger: Artificer,
    rogue: Artificer,
    sorcerer: Artificer,
    warlock: Artificer,
    wizard: Artificer,
  }

  def self.build(name)
    ALL[name].new
  end

  def self.names
    ALL.keys.freeze
  end

  def self.test
    puts 'this is a test'
  end
end