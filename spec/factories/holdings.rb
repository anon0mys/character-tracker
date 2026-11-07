FactoryBot.define do
  factory :holding do
    game
    item
    quantity { 1 }
    status { "carried" }
  end
end
