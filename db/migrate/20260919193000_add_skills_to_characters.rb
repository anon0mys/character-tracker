class AddSkillsToCharacters < ActiveRecord::Migration[6.1]
  def change
    change_table :characters, bulk: true do |t|
      t.string :expertise, array: true, default: [], null: false
      t.jsonb :custom_skills, default: [], null: false
    end
  end
end
