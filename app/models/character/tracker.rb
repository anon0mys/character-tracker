class Character
  class Tracker < ApplicationRecord
    self.table_name = "character_trackers"

    RESET_ON = %w[short_rest long_rest dawn manual never].freeze

    belongs_to :character

    validates :name, presence: true
    validates :max_uses, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
    validates :current_uses, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
    validates :reset_on, inclusion: { in: RESET_ON }
    validate :current_uses_within_max

    private

    def current_uses_within_max
      return if current_uses.nil? || max_uses.nil?
      return if current_uses <= max_uses

      errors.add(:current_uses, "cannot exceed max_uses")
    end
  end
end
