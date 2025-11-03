class Npc < ApplicationRecord
  extend Combinable

  enum archetype: combine_to_hash(Archetypes.names)

  belongs_to :location
  has_many :faction_npcs
  has_many :factions, through: :faction_npcs

  validates :name, :race, presence: true
end
