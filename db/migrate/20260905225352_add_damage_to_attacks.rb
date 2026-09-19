class AddDamageToAttacks < ActiveRecord::Migration[6.1]
  def change
    add_column :attacks, :damage, :string
  end
end
