FactoryBot.define do
  casting_times = %w[cantrip 1 2 3 4 5 6 7 8 9]
  ranges = ["10 Feet", "Self", "Touch"]
  durations = ["Instantaneous", "1 round", "1 minute"]
  descriptors = ["Ray", "Bolt", "Hand", "Blade", "Armor"]
  nouns = ["Fire", "Flame", "Frost", "Acid", "Strength"]

  factory :spell do
    name { descriptors.sample + 'of' + nouns.sample }
    description { 'This spell does some things' }
    archetypes { rand(1..5).times.map { Archetypes.names.sample } }
    level { Spell::LEVELS.sample }
    school { Spell::SCHOOLS.sample }
    casting_time { casting_times.sample }
    range { ranges.sample }
    duration { durations.sample } 
    components { rand(1..3).times.map { Spell::COMPONENTS.sample } }
  end
end
