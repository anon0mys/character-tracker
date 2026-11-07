FactoryBot.define do
  factory :race do
    sequence(:name) { |n| "Test Race #{n}" }
    category { "Standard" }
    source { "Player's Handbook" }
    size { "Medium" }
    speed { 30 }
    traits { [{ "name" => "Darkvision", "description" => "You can see in the dark." }] }
    subraces { [] }
    alternate_versions { [] }
  end
end
