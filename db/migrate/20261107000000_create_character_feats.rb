class CreateCharacterFeats < ActiveRecord::Migration[6.1]
  def change
    create_table :character_feats do |t|
      t.references :character, null: false, foreign_key: true
      t.references :feat, null: false, foreign_key: true
      t.timestamps
    end
    add_index :character_feats, %i[character_id feat_id], unique: true
  end
end
