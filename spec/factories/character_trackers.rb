FactoryBot.define do
  factory :character_tracker, class: "Character::Tracker" do
    character
    name { "Flash of Genius" }
    max_uses { 3 }
    current_uses { 0 }
    reset_on { "long_rest" }
    category { "feature" }
    description { nil }
    sort_order { 0 }
  end
end
