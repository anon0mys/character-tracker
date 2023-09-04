FactoryBot.define do
  factory :character do
    name { Faker::Name.name }
    archetype { :artificer }
    association :user
    association :game

    trait :with_sheet do
      character_sheet { CharacterSheet.new({
        name: 'Kai',
        race: 'Domesticae (Goat)',
        archetype: :artificer,
        level: 5,
        background: 'Guild Artisan',
        alignment: 'CG',
        age: 38,
        speed: 30,
        initiative_bonus: 0,
        ac_bonus: 6,
        proficiencies: [:constitution, :intelligence],
        ability_scores: {
          strength: 12,
          dexterity: 11,
          constitution: 14,
          intelligence: 16,
          wisdom: 10,
          charisma: 10,
        }
      })}
    end
  end
end
