class Item < ApplicationRecord
  extend Combinable

  STATUSES = %w[sold stored equipped].freeze
  ITEM_TYPES = %w[
    Ammo Arcane Armor Gear Gem Holy Jewelry Poison Potion Rod
    Scroll Staff Tool Wand Weapon Wondrous
  ].freeze
  QUALITIES = %w[common uncommon rare very_rare legendary artifact]

  enum status: combine_to_hash(STATUSES)
  enum item_type: combine_to_hash(ITEM_TYPES)

  validates_presence_of :name
  has_many :character_items
  has_many :characters, through: :character_items
end
