class CreateSpells < ActiveRecord::Migration[6.1]
  def change
    create_table :spells do |t|
      t.string :name
      t.text :description
      t.text :archetypes, array: true, default: []
      t.string :level, null: false, default: 'cantrip'
      t.string :school, null: false, default: 'abjuration'
      t.string :casting_time
      t.string :range
      t.string :duration
      t.string :components, array: true, default: []

      t.timestamps
    end
  end
end
