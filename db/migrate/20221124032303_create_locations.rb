class CreateLocations < ActiveRecord::Migration[6.1]
  def change
    create_table :locations do |t|
      t.string :name
      t.string :description
      t.string :location_type, null: false, default: 'zone'

      t.timestamps
    end
  end
end
