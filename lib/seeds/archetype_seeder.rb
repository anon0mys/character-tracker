module ArchetypeSeeder
  module_function

  def call # rubocop:disable Metrics/AbcSize
    labels = JSON.parse(Rails.root.join("lib/seeds/archetype_labels.json").read)

    Archetypes.names.each do |key|
      archetype = Archetypes.new(key)
      Archetype.find_or_initialize_by(name: key.to_s).update!(
        hit_die: archetype.hit_die,
        spellcasting_ability: archetype.spellcasting_ability&.to_s,
        hit_points_at_1st_level: archetype.hit_points_at_1st_level,
        hit_points_at_higher_levels: archetype.hit_points_at_higher_levels,
        proficiencies: archetype.proficiencies,
        equipment: archetype.class_data&.dig("equipment") || [],
        spellcasting: archetype.spellcasting_data,
        class_features: archetype.class_features,
        subclass_label: labels[key.to_s],
        source: "SRD / dnd5e.wikidot.com",
      )
    end

    File.foreach(Rails.root.join("lib/seeds/subclass_data.json")) do |line|
      data = JSON.parse(line)
      archetype = Archetype.find_by(name: data["archetype"])
      next unless archetype

      Subclass.find_or_initialize_by(archetype:, name: data["name"]).update!(
        slug: data["slug"], source: data["source"],
      )
    end
  end
end
