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

archetype_labels = JSON.parse(File.read(Rails.root.join('lib', 'seeds', 'archetype_labels.json')))

Archetypes.names.each do |key|
  a = Archetypes.new(key)
  Archetype.find_or_initialize_by(name: key.to_s).update!(
    hit_die: a.hit_die,
    spellcasting_ability: a.spellcasting_ability&.to_s,
    hit_points_at_1st_level: a.hit_points_at_1st_level,
    hit_points_at_higher_levels: a.hit_points_at_higher_levels,
    proficiencies: a.proficiencies,
    equipment: a.class_data&.dig('equipment') || [],
    spellcasting: a.spellcasting_data,
    class_features: a.class_features,
    subclass_label: archetype_labels[key.to_s],
    source: 'SRD / dnd5e.wikidot.com'
  )
end

File.foreach(Rails.root.join('lib', 'seeds', 'subclass_data.json')) do |line|
  d = JSON.parse(line)
  archetype = Archetype.find_by(name: d['archetype'])
  next unless archetype

  Subclass.find_or_initialize_by(archetype:, name: d['name']).update!(
    slug: d['slug'], source: d['source']
  )
end

Character.where(archetype_id: nil).find_each do |character|
  archetype = Archetype.find_by('lower(name) = ?', character[:archetype].to_s.downcase)
  character.update_columns(archetype_id: archetype.id) if archetype
end
