FactoryBot.define do
  factory :monster do
    sequence(:name) { |n| "Test Beast #{n}" }
    size { "Medium" }
    creature_type { "Beast" }
    alignment { "unaligned" }
    armor_class { 12 }
    hit_points { 11 }
    challenge_rating { "1" }
    strength { 10 }
    dexterity { 10 }
    constitution { 10 }
    intelligence { 3 }
    wisdom { 10 }
    charisma { 6 }
    stat_block { { "actions" => [{ "name" => "Bite", "desc" => "Does a bite." }] } }
  end
end
