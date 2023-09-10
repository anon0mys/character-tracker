module Archetypes
  ALL = {
    artificer: Artificer,
    barbarian: Barbarian,
    bard: Bard,
    cleric: Cleric,
    druid: Druid,
    fighter: Fighter,
    monk: Monk,
    paladin: Paladin,
    ranger: Ranger,
    rogue: Rogue,
    sorcerer: Sorcerer,
    warlock: Warlock,
    wizard: Wizard,
  }

  def self.new(name=nil)
    ALL.dig(name&.to_sym)&.new
  end

  def self.names
    ALL.keys.freeze
  end
end