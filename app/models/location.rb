class Location < ApplicationRecord
  extend Combinable

  LOCATION_TYPES = %w[zone city building site].freeze

  enum location_type: combine_to_hash(LOCATION_TYPES)

  has_many :factions
  has_many :npcs
  
  validates_presence_of :name
end