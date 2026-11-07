class CharacterFeat < ApplicationRecord
  belongs_to :character
  belongs_to :feat

  validates :feat_id, uniqueness: { scope: :character_id }
end
