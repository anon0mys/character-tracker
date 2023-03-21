class CreateGames < ActiveRecord::Migration[6.1]
  def change
    create_table :games do |t|
      t.string :name
      t.text :description
      t.string :status, null: false, default: 'active'
      t.datetime :start_date

      t.timestamps
    end
  end
end
