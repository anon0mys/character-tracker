class AddCombatFieldsToAttacks < ActiveRecord::Migration[6.1]
  def change
    change_table :attacks, bulk: true do |t|
      t.string :action_type, default: "action", null: false
      t.boolean :extra_attack, default: false, null: false
      t.jsonb :riders, default: [], null: false
    end
  end
end
