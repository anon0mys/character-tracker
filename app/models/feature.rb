class Feature < ApplicationRecord
  CATEGORIES = %w[class subclass racial feat infusion item blessing other].freeze

  belongs_to :character

  validates :name, presence: true
  validates :category, inclusion: { in: CATEGORIES }
end
