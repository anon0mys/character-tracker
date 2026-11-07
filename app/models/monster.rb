class Monster < ApplicationRecord
  include Filterable

  validates :name, presence: true, uniqueness: { case_sensitive: false }

  scope :id_eq, ->(id) { where(id:) }
  scope :name_eq, ->(name) { where("name ILIKE ?", "%#{name}%") }
  scope :creature_type_eq, ->(type) { where(creature_type: type) }
  scope :challenge_rating_eq, ->(cr) { where(challenge_rating: cr) }
  scope :size_eq, ->(size) { where(size:) }
end
