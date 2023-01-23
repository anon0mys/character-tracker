class SpellList < ApplicationRecord
  belongs_to :character
  has_many :spell_list_items
  has_many :spells, through: :spell_list_items

  validates_presence_of :name

  def add_spell(spell)
    return if spell_list_items.find_by(spell: spell)
    spell_list_items.create!(spell: spell)
  end
end