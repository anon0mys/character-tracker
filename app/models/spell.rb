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

  default_scope { by_level }
  scope :by_level, -> { order(order_by_level) }
  scope :name_eq, -> (name) { where 'name ILIKE ?', "%#{name.downcase}%" }
  scope :archetype_eq, -> (archetype) { where "archetypes && ?", "{#{archetype.join(',')}}" }
  scope :level_eq, -> (levels) { 
    levels = Array(levels)
    where(level: levels)
  }
  scope :school_eq, -> (schools) { 
    schools = Array(schools)
    where(school: schools)
  }

  def self.order_by_level
    Arel.sql(
      %q(
        case level
        when 'cantrip' then 0
        when '1' then 1
        when '2' then 2
        when '3' then 3
        when '4' then 4
        when '5' then 5
        when '6' then 6
        when '7' then 7
        when '8' then 8
        else 9 end
      )
    )
  end

  def self.ransackable_scopes(_auth_object = nil)
    %i(archetype_eq)
  end
end
