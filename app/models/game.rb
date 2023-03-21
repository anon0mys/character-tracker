class Game < ApplicationRecord
  extend Combinable
  STATUSES = %w[pending active finished].freeze

  enum status: combine_to_hash(STATUSES)
end