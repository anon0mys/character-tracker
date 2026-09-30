class SpellList < ApplicationRecord
  belongs_to :character
  has_many :spell_list_items
  has_many :spells, through: :spell_list_items

  validates :name, presence: true

  # Idempotent: adding a spell already in the list is a no-op that returns the
  # existing item. Archetype/availability validation still raises via save!.
  def add_spell(spell)
    existing = spell_list_items.find_by(spell:)
    return existing if existing

    item = spell_list_items.build(spell:)
    item.save!
    item
  end
end
