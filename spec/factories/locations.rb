FactoryBot.define do
  factory :location do
    sequence(:name) { |n| "Location #{n}" }
    location_type { "zone" }
  end
end
