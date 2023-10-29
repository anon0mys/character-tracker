FactoryBot.define do
  factory :character do
    name { Faker::Name.name }
    archetype { :artificer }
    race { 'Domesticae (Goat)' }
    level { 1 }
    background { 'Guild Artisan' }
    alignment { 'CG' }
    age { 38 }
    speed { 30 }
    initiative_bonus { 0 }
    ac_bonus { 0 }
    proficiencies { [:constitution, :intelligence] }
    strength { 10 }
    dexterity { 10 }
    constitution { 10 }
    intelligence { 10 }
    wisdom { 10 }
    charisma { 10 }

    association :user
    association :game
  end
end
