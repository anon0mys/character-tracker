FactoryBot.define do
  factory :character do
    name { Faker::Name.name }
    archetype { :artificer }
    association :user
    association :game
  end
end
