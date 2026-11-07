class Race < ApplicationRecord
  include Filterable

  validates :name, presence: true, uniqueness: { case_sensitive: false }

  scope :name_eq, ->(name) { where("name ILIKE ?", "%#{name}%") }

  # Case-insensitive id lookup for the free-text name a character stores.
  def self.id_for(name)
    where("lower(name) = ?", name.to_s.downcase).pick(:id)
  end
  scope :category_eq, ->(category) { where(category:) }
  scope :size_eq, ->(size) { where(size:) }
  scope :source_eq, ->(source) { where("source ILIKE ?", "%#{source}%") }

  # Subraces from the primary entry plus every alternate-source version.
  def all_subraces
    subraces + alternate_versions.flat_map { |version| version["subraces"] || [] }
  end

  def subrace_named(name)
    return nil if name.blank?

    all_subraces.find { |subrace| subrace["name"].to_s.casecmp?(name) }
  end
end
