# Features a character has by virtue of their class, subclass, race and
# background. Nothing here is stored: each call projects the compendium rows
# the character currently points at. Homebrew later only has to make those
# rows user-owned; this projection does not change.
class DerivedFeatures
  Row = Struct.new(:category, :name, :description, keyword_init: true)

  def self.for(character)
    new(character).rows
  end

  def initialize(character)
    @character = character
  end

  def rows
    class_rows + subclass_rows + racial_rows + background_rows
  end

  private

  attr_reader :character

  def class_rows
    (1..character.level).flat_map do |level|
      build("class", character.archetype.features_at_level(level))
    end
  end

  def subclass_rows
    subclass = character.archetype.try(:subclasses)&.find_by("lower(name) = ?", character.subclass.to_s.downcase)
    return [] unless subclass

    build("subclass", subclass.features)
  end

  def racial_rows
    race = character.race_record
    return [] unless race

    subrace = race.subrace_named(character.subrace)
    build("racial", race.traits + (subrace ? subrace["traits"] : []))
  end

  def background_rows
    background = character.background_record
    return [] unless background

    build("background", background.features + background.variants)
  end

  def build(category, entries)
    (entries || []).filter_map do |entry|
      next if entry["name"].blank?

      Row.new(category:, name: entry["name"], description: entry["description"])
    end
  end
end
