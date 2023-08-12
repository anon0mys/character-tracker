class UserGame < ApplicationRecord
  extend Combinable
  STATUSES = %w[active dropped].freeze
  ROLES = %w[player admin dm].freeze

  enum status: combine_to_hash(STATUSES)
  enum role: combine_to_hash(ROLES)

  belongs_to :user
  belongs_to :game

  validates_uniqueness_of :user_id, scope: %i[game_id]
end