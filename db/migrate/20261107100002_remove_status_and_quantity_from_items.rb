class RemoveStatusAndQuantityFromItems < ActiveRecord::Migration[6.1]
  def change
    change_table :items, bulk: true do |t|
      t.remove :status, type: :string
      t.remove :quantity, type: :integer, default: 1
    end
  end
end
