class Npc < ApplicationRecord
  extend Combinable

  enum archetype: combine_to_hash(Archetypes.names)

  belongs_to :game, optional: true
  belongs_to :location, optional: true
  has_many :faction_npcs
  has_many :factions, through: :faction_npcs
  has_many :holdings, as: :holder, dependent: :destroy

  validates :name, presence: true
end
