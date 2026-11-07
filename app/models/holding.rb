# One copy, or a pile of copies, of an item somewhere in a campaign. The holder
# is a character, an NPC, a place, or another holding (a container); a holding
# with no holder is "not placed". Sold, lost and destroyed copies stay on record.
class Holding < ApplicationRecord
  extend Combinable

  STATUSES = %w[equipped carried stored sold lost destroyed].freeze
  GONE_STATUSES = %w[sold lost destroyed].freeze
  HOLDER_TYPES = %w[Character Npc Location Holding].freeze

  # Prefixed: a "destroyed" status would otherwise shadow ActiveRecord's destroyed?.
  enum status: combine_to_hash(STATUSES), _prefix: true

  belongs_to :game
  belongs_to :item
  belongs_to :holder, polymorphic: true, optional: true
  has_many :contents, class_name: "Holding", as: :holder, dependent: :nullify

  validates :holder_type, inclusion: { in: HOLDER_TYPES }, allow_nil: true
  validates :quantity, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validate :holder_in_same_game
  validate :not_inside_itself

  scope :held, -> { where.not(status: GONE_STATUSES) }
  scope :gone, -> { where(status: GONE_STATUSES) }

  def gone?
    GONE_STATUSES.include?(status)
  end

  def container?
    contents.exists?
  end

  # The holding's own name, so a container can label the things inside it.
  delegate :name, to: :item

  private

  def holder_in_same_game
    return if holder.nil? || holder.game_id == game_id

    errors.add(:holder, "must be in the same campaign")
  end

  def not_inside_itself
    return unless holder.is_a?(Holding)

    ancestor = holder
    while ancestor
      return errors.add(:holder, "cannot be the holding itself or something inside it") if ancestor.id == id

      ancestor = ancestor.holder.is_a?(Holding) ? ancestor.holder : nil
    end
  end
end
