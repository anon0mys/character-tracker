class Character < ApplicationRecord
  extend Combinable

  enum archetype: combine_to_hash(Archetypes.names)
  belongs_to :user
  validates_presence_of :name, :archetype
end
