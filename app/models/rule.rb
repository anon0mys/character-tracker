# A section of the game's rules (combat, conditions, resting...), as markdown,
# for the compendium. Seeded from the SRD 5.1; see lib/seeds/rule_seeder.rb.
class Rule < ApplicationRecord
  validates :name, :slug, :category, presence: true
  validates :slug, uniqueness: true
end
