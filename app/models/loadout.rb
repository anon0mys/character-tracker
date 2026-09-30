class Loadout < ApplicationRecord
  belongs_to :character

  validates :name, presence: true
  validate :single_active_per_character

  def speed_bonus
    (modifiers || {})["speed_bonus"].to_i
  end

  def ac_bonus
    (modifiers || {})["ac_bonus"].to_i
  end

  private

  def single_active_per_character
    return unless active?

    clash = character.loadouts.where(active: true).where.not(id:)
    errors.add(:active, "there can be only one active loadout") if clash.exists?
  end
end
