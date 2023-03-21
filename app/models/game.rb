class Game < ApplicationRecord
  extend Combinable
  STATUSES = %w[pending active finished].freeze

  enum status: combine_to_hash(STATUSES)

  has_many :characters
  has_many :user_games
  has_many :users, through: :user_games
end