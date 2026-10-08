# Archetypes/subclasses are reference data; seed once before the suite so
# Character#archetype exercises the DB-backed Archetype model (not the fallback).
RSpec.configure do |config|
  config.before(:suite) do
    require Rails.root.join("lib/seeds/archetype_seeder")
    ArchetypeSeeder.call
  end
end
