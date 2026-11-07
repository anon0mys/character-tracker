class Background < ApplicationRecord
  include Filterable

  validates :name, presence: true, uniqueness: { case_sensitive: false }

  scope :name_eq, ->(name) { where("name ILIKE ?", "%#{name}%") }

  # Case-insensitive id lookup for the free-text name a character stores.
  def self.id_for(name)
    where("lower(name) = ?", name.to_s.downcase).pick(:id)
  end
  scope :source_eq, ->(source) { where("source ILIKE ?", "%#{source}%") }
end
