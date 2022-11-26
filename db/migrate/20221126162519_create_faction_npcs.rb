class CreateFactionNpcs < ActiveRecord::Migration[6.1]
  def change
    create_table :faction_npcs do |t|
      t.belongs_to :npc, index: { unique: true }, foreign_key: true
      t.belongs_to :faction, index: { unique: true }, foreign_key: true

      t.timestamps
    end
  end
end
