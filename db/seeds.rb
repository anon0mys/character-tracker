require 'csv'

File.foreach(Rails.root.join('lib', 'seeds', 'spell_data.json')) do |line|
  spell_data = JSON.parse(line)
  Spell.create!(spell_data)
end

AdminUser.create!(
  email: 'admin@example.com',
  password: 'password',
  password_confirmation: 'password'
) if Rails.env.development? && !AdminUser.exists?(email: 'admin@example.com')
