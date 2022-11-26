class Faction < ApplicationRecord
  has_many :faction_npcs
  has_many :faction_locations
  has_many :npcs, through: :faction_npcs
  has_many :locations, through: :faction_locations
  
  validates_presence_of :name
end