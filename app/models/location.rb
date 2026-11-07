class Location < ApplicationRecord
  extend Combinable

  LOCATION_TYPES = %w[zone city building site].freeze

  enum location_type: combine_to_hash(LOCATION_TYPES)

  has_many :faction_locations
  has_many :factions, through: :faction_locations
  belongs_to :game, optional: true
  has_many :npcs
  has_many :holdings, as: :holder, dependent: :destroy

  validates :name, presence: true
end
