class Item < ApplicationRecord
  extend Combinable
  include Filterable

  ITEM_TYPES = %w[
    ammo arcane armor gear gem holy jewelry poison potion rod
    scroll staff tool wand weapon wondrous
  ].freeze
  QUALITIES = %w[common uncommon rare very_rare legendary artifact].freeze
  # Published items carry their book at the front of the scraped description,
  # just before the item's kind ("Source: Dungeon Master's Guide Ring, rare").
  SOURCE_KINDS = "Wondrous item|Wondrous Item|Weapon|Armor|Ring|Rod|Staff|Wand|Potion|Scroll|Ammunition|Shield".freeze
  SOURCE_PATTERN = /\ASource: (.+?) (?:#{SOURCE_KINDS})\b/

  enum item_type: combine_to_hash(ITEM_TYPES)

  validates :name, presence: true, uniqueness: { case_sensitive: false }
  has_many :holdings, dependent: :restrict_with_error

  before_save :read_source_from_description, if: -> { source.blank? && !homebrew? }

  scope :id_eq, ->(id) { where(id:) }
  scope :name_eq, ->(name) { where "name ILIKE ?", "%#{name.downcase}%" }
  scope :item_type_eq, ->(item_type) { where item_type: }
  scope :quality_eq, ->(quality) { where quality: }
  scope :homebrew_eq, ->(homebrew) { where homebrew: ActiveModel::Type::Boolean.new.cast(homebrew) }
  scope :tag_eq, ->(tag) { where("? = ANY(tags)", tag) }

  private

  def read_source_from_description
    self.source = description.to_s[SOURCE_PATTERN, 1]
  end
end
