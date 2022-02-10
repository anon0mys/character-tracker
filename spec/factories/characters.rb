FactoryBot.define do
  factory :character do
    name { Faker::Name.name }
    archetype { :artificer }
    association :user
  end
end
