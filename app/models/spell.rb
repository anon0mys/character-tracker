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

  default_scope { order(id: :desc) }
  scope :name_eq, -> (name) { where 'name ILIKE ?', "%#{name.downcase}%" }
  scope :archetype_eq, -> (archetype) { where "archetypes && ?", "{#{archetype.join(',')}}" }
  scope :level_eq, -> (level) { where level: level }
  scope :school_eq, -> (school) { where school: school }

  def self.ransackable_scopes(_auth_object = nil)
    %i(archetype_eq)
  end
end
