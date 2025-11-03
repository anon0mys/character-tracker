class Game < ApplicationRecord
  extend Combinable
  STATUSES = %w[pending active finished deleted].freeze

  scope :default, -> { where.not(status: :deleted) }

  enum status: combine_to_hash(STATUSES)

  has_many :characters
  has_many :user_games
  has_many :users, through: :user_games

  attribute :status, :string, default: "pending"
end
