class Subclass < ApplicationRecord
  belongs_to :archetype

  validates :name, presence: true, uniqueness: { scope: :archetype_id, case_sensitive: false }
end
