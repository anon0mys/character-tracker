class AddHitpointsAndCurrentSpellsToCharacter < ActiveRecord::Migration[6.1]
  def change
    add_column :characters, :current_hitpoints, :integer
    add_reference :characters, :current_spell_list, references: :spell_list, index: true
  end
end
