FactoryBot.define do
  CASTING_TIMES = %w[cantrip 1 2 3 4 5 6 7 8 9]
  RANGES = ["10 Feet", "Self", "Touch"]
  DURATIONS = ["Instantaneous", "1 round", "1 minute"]
  DESCRIPTORS = ["Ray", "Bolt", "Hand", "Blade", "Armor"]
  NOUNS = ["Fire", "Flame", "Frost", "Acid", "Strength"]

  factory :spell do
    name { DESCRIPTORS.sample + 'of' + NOUNS.sample }
    description { 'This spell does some things' }
    archetypes { rand(1..5).times.map { Archetypes.names.sample } }
    level { Spell::LEVELS.sample }
    school { Spell::SCHOOLS.sample }
    casting_time { CASTING_TIMES.sample }
    range { RANGES.sample }
    duration { DURATIONS.sample } 
    components { rand(1..3).times.map { Spell::COMPONENTS.sample } }
  end
end
