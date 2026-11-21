class UserGame < ApplicationRecord
  extend Combinable
  STATUSES = %w[active dropped].freeze
  ROLES = %w[player admin dm].freeze
  # Admins and DMs run the campaign: they invite people and manage members.
  MANAGER_ROLES = %w[admin dm].freeze

  enum status: combine_to_hash(STATUSES)
  enum role: combine_to_hash(ROLES)

  belongs_to :user
  belongs_to :game

  validates :user_id, uniqueness: { scope: %i[game_id] }

  scope :managers, -> { active.where(role: MANAGER_ROLES) }

  def manager?
    active? && MANAGER_ROLES.include?(role)
  end

  # The campaign would be left with no one to run it without this member.
  def last_manager?
    manager? && game.user_games.managers.where.not(id:).none?
  end
end
