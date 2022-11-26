class CreateFactionLocations < ActiveRecord::Migration[6.1]
  def change
    create_table :faction_locations do |t|
      t.belongs_to :faction, index: { unique: true }, foreign_key: true
      t.belongs_to :location, index: { unique: true }, foreign_key: true

      t.timestamps
    end
  end
end
