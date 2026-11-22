FactoryBot.define do
  factory :rule do
    sequence(:name) { |n| "Test Rule #{n}" }
    sequence(:slug) { |n| "test-rule-#{n}" }
    category { "Combat" }
    sequence(:position)
    body { "A target with **half cover** has a +2 bonus to AC." }
    source { "SRD 5.1" }
  end
end
