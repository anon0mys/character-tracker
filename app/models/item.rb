class Item < ApplicationRecord
  extend Combinable
  include Filterable

  STATUSES = %w[sold stored equipped].freeze
  ITEM_TYPES = %w[
    ammo arcane armor gear gem holy jewelry poison potion rod
    scroll staff tool wand weapon wondrous
  ].freeze
  QUALITIES = %w[common uncommon rare very_rare legendary artifact].freeze

  enum status: combine_to_hash(STATUSES)
  enum item_type: combine_to_hash(ITEM_TYPES)

  validates :name, presence: true, uniqueness: { case_sensitive: false }
  has_many :character_items
  has_many :characters, through: :character_items

  scope :id_eq, ->(id) { where(id:) }
  scope :name_eq, ->(name) { where "name ILIKE ?", "%#{name.downcase}%" }
  scope :status_eq, ->(status) { where status: }
  scope :item_type_eq, ->(item_type) { where item_type: }
  scope :quality_eq, ->(quality) { where quality: }
end
