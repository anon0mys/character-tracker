FactoryBot.define do
  factory :npc do
    sequence(:name) { |n| "NPC #{n}" }
    race { "Human" }
    archetype { "artificer" }
    location
  end
end
