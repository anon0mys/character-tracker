# A place in a campaign. Places nest freely (the type is only a label), and can
# store items and be where NPCs are found.
class Location < ApplicationRecord
  extend Combinable

  LOCATION_TYPES = %w[zone city building site].freeze

  enum location_type: combine_to_hash(LOCATION_TYPES)

  has_many :faction_locations, dependent: :destroy
  has_many :factions, through: :faction_locations
  belongs_to :game, optional: true
  belongs_to :parent, class_name: "Location", optional: true
  has_many :children, class_name: "Location", foreign_key: :parent_id, inverse_of: :parent
  has_many :npcs
  has_many :holdings, as: :holder

  validates :name, presence: true
  validate :parent_in_same_game
  validate :not_inside_itself

  private

  def parent_in_same_game
    return if parent.nil? || parent.game_id == game_id

    errors.add(:parent, "must be in the same campaign")
  end

  def not_inside_itself
    ancestor = parent
    while ancestor
      return errors.add(:parent, "cannot be the place itself or somewhere inside it") if ancestor.id == id

      ancestor = ancestor.parent
    end
  end
end
