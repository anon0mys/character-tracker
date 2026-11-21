# A link to join a campaign. A player link works for anyone who has it until
# it expires or is revoked; a DM link works once.
class GameInvite < ApplicationRecord
  ROLES = %w[player dm].freeze
  LIFETIME = 14.days

  class Unusable < StandardError; end

  belongs_to :game
  belongs_to :created_by, class_name: "User"

  validates :role, inclusion: { in: ROLES }
  validates :token, presence: true, uniqueness: true

  before_validation :set_defaults, on: :create

  scope :usable, lambda {
    where(revoked_at: nil).where("expires_at > ?", Time.current)
                          .where("max_uses IS NULL OR uses_count < max_uses")
  }

  def usable?
    revoked_at.nil? && expires_at.future? && (max_uses.nil? || uses_count < max_uses)
  end

  def revoke!
    update!(revoked_at: Time.current)
  end

  # Makes user an active member with this link's role. Someone already in the
  # campaign keeps their role, except that a DM link makes a player the DM.
  # Only a link that changed something counts as used. Returns the membership.
  def accept!(user)
    with_lock do
      raise Unusable, "This invite has expired or been used up" unless usable?

      membership = game.user_games.find_or_initialize_by(user:)
      membership.status = :active
      membership.role = role if membership.new_record? || (role == "dm" && membership.player?)
      changed = membership.new_record? || membership.changed?
      membership.save!
      update!(uses_count: uses_count + 1) if changed
      membership
    end
  end

  private

  def set_defaults
    self.token ||= SecureRandom.urlsafe_base64(18)
    self.expires_at ||= LIFETIME.from_now
    self.max_uses ||= 1 if role == "dm"
  end
end
