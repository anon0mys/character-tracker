class Feat < ApplicationRecord
  include Filterable

  validates :name, presence: true, uniqueness: { case_sensitive: false }

  scope :name_eq, ->(name) { where("name ILIKE ?", "%#{name}%") }
  scope :source_eq, ->(source) { where("source ILIKE ?", "%#{source}%") }

  # Prerequisite, description and benefits as one block for the sheet.
  def sheet_description
    lines = [prerequisite.presence && "Prerequisite: #{prerequisite}", description]
    lines += benefits.map { |benefit| "• #{benefit}" }
    lines.compact_blank.join("\n")
  end
end
