class Spell < ApplicationRecord
  extend Combinable
  include Filterable

  LEVELS = %w[cantrip 1 2 3 4 5 6 7 8 9].freeze
  SCHOOLS = %w[abjuration conjuration divination enchantment evocation illusion necromancy transmutation].freeze
  COMPONENTS = %w[V S M].freeze

  enum level: combine_to_hash(LEVELS)
  enum school: combine_to_hash(SCHOOLS)

  validates :archetypes, array: { presence: true, inclusion: { in: Archetypes.names.map(&:to_s) } }
  validates :components, array: { presence: true, inclusion: { in: COMPONENTS } }
  validates_presence_of :name, :casting_time, :range, :duration

  scope :filter_by_archetype, -> (archetype) { where "archetypes && ?", "{#{archetype}}" }
  scope :filter_by_level, -> (level) { where level: level }
  scope :filter_by_school, -> (school) { where school: school }
end