class SpellList < ApplicationRecord
  belongs_to :character
  has_many :spell_list_items
  has_many :spells, through: :spell_list_items

  validates_presence_of :name
end