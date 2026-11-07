FactoryBot.define do
  factory :feat do
    sequence(:name) { |n| "Test Feat #{n}" }
    source { "Player's Handbook" }
    description { "You gain the following benefits:" }
    benefits { ["You can't be surprised while you are conscious."] }
  end
end
