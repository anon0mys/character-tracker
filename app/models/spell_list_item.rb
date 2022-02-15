class SpellListItem < ApplicationRecord
  belongs_to :spell
  belongs_to :spell_list
  validate :character_can_learn_spell

  private

  def character_can_learn_spell
    if !spell.archetypes.include?(spell_list.character.archetype)
      errors.add(:code, "spell is not availble to this character archetype")
    end
  end
end