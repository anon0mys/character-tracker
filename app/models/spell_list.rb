class SpellList < ApplicationRecord
  belongs_to :character
  has_many :spell_list_items
  has_many :spells, through: :spell_list_items

  validates :name, presence: true

  def add_spell(spell)
    if spell_list_items.exists?(spell:)
      item = spell_list_items.find_by(spell:)
      item.errors.add(:base, "This spell is already in the list")
      raise ActiveRecord::RecordInvalid, item
    end
    item = spell_list_items.build(spell:)
    item.save!
    item
  end
end
