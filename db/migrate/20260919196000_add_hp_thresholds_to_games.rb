class AddHpThresholdsToGames < ActiveRecord::Migration[6.1]
  def change
    add_column :games, :hp_thresholds, :jsonb, default: { bloodied: 0.5, mangled: 0.25 }, null: false
  end
end
