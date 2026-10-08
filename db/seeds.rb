require 'csv'

File.foreach(Rails.root.join('lib', 'seeds', 'spell_data.json')) do |line|
  spell_data = JSON.parse(line)
  Spell.find_or_initialize_by(name: spell_data['name']).update!(spell_data)
end

File.foreach(Rails.root.join('lib', 'seeds', 'item_data.json')) do |line|
  item_data = JSON.parse(line)
  Item.find_or_initialize_by(name: item_data['name']).update!(item_data)
end

AdminUser.create!(
  email: 'admin@example.com',
  password: 'password',
  password_confirmation: 'password'
) if Rails.env.development? && !AdminUser.exists?(email: 'admin@example.com')

User.create!(
  email: 'admin@example.com',
  password: 'password',
  password_confirmation: 'password'
) if Rails.env.development? && !User.exists?(email: 'admin@example.com')
