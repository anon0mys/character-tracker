FactoryBot.define do
  factory :background do
    sequence(:name) { |n| "Test Background #{n}" }
    source { "Player's Handbook" }
    skill_proficiencies { "Insight, Religion" }
    features { [{ "name" => "Shelter of the Faithful", "description" => "You command respect." }] }
    variants { [] }
    characteristics { { "ideals" => ["Tradition."] } }
  end
end
