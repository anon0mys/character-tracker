FactoryBot.define do
  factory :item do
    name { Faker::JapaneseMedia::SwordArtOnline.item }
    item_type { Item::ITEM_TYPES.sample }
    status { Item::STATUSES.sample }
    quality { Item::QUALITIES.sample }
    potential_damage { Faker::Number.within(range: 1..50) }
    total_charges { Faker::Number.within(range: 0..5) }
    value { Faker::Number.within(range: 0..999999) }
    quantity { Faker::Number.within(range: 1..10) }
    requires_attunement { Faker::Boolean.boolean }
    ac { Faker::Number.within(range: 1..10) }
    stat_bonuses {{ int: 1, atk: 2, fire_damage: '2d6' }}
  end
end
