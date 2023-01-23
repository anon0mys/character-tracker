class Character < ApplicationRecord
  extend Combinable

  enum archetype: combine_to_hash(Archetypes.names)
  belongs_to :user
  validates_presence_of :name, :archetype
  has_many :spell_lists
  has_many :character_items
  has_many :items, through: :character_items
end
