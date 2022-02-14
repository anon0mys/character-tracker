class Character < ApplicationRecord
  extend Combinable

  enum archetype: combine_to_hash(Archetypes.names)
  belongs_to :user
  has_many :spell_lists
  validates_presence_of :name, :archetype
end
