class AddEphemeralTrackingToCharacters < ActiveRecord::Migration[6.1]
  def change
    change_table :characters, bulk: true do |t|
      t.integer :temp_hitpoints, default: 0, null: false
      t.integer :max_hitpoints_bonus, default: 0, null: false
      t.integer :hit_dice_remaining
      t.integer :inspiration, default: 0, null: false
      t.integer :death_save_successes, default: 0, null: false
      t.integer :death_save_failures, default: 0, null: false
      t.integer :exhaustion, default: 0, null: false
      t.jsonb :spell_slots_used, default: {}, null: false
      t.string :concentration_spell
      t.integer :copper, default: 0, null: false
      t.integer :silver, default: 0, null: false
      t.integer :electrum, default: 0, null: false
      t.integer :gold, default: 0, null: false
      t.integer :platinum, default: 0, null: false
    end
  end
end
