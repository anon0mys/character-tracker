class SpellListItem < ApplicationRecord
  belongs_to :spell
  belongs_to :spell_list
  validate :character_can_learn_spell
  validate :spell_list_not_exceeding_prepared_limit

  private

  def character_can_learn_spell
    if !spell.archetypes.include?(spell_list.character.archetype.name.to_s)
      errors.add(:code, "spell is not availble to this character archetype")
    end
  end

  def spell_list_not_exceeding_prepared_limit
    character = spell_list.character
    return unless character.archetype.caster?
    
    max_prepared = character.max_spells_prepared
    return if max_prepared.nil? # No limit for this caster type
    
    # Skip validation for cantrips (they don't count against prepared spells)
    return if spell.level == 'cantrip'
    
    # Count non-cantrip spells in the list, excluding this item if it's persisted
    existing_items = spell_list.spell_list_items
    existing_items = existing_items.where.not(id: id) if persisted?
    
    current_spell_count = existing_items.joins(:spell)
                                      .where.not(spells: { level: 'cantrip' })
                                      .count
    
    # If this is a new record, add 1 to account for the spell being added
    new_spell_count = persisted? ? current_spell_count : current_spell_count + 1
    
    if new_spell_count > max_prepared
      # Determine if this is a prepared caster or known caster
      spell_type = character.archetype.spells_prepared_formula.present? ? 'prepared' : 'known'
      errors.add(:base, "Spell list cannot exceed #{max_prepared} #{spell_type} spells for this character (currently #{new_spell_count}). Character can have a maximum of #{max_prepared} #{spell_type} spells.")
    end
  end
end
