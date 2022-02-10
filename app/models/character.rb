class Character < ApplicationRecord
  enum archetype: Archetypes.names
  belongs_to :user
  validates_presence_of :name, :archetype
end
