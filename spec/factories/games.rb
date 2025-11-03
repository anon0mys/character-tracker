FactoryBot.define do
  factory :game do
    name { "Faker::Figure out a name generator that is fantasy" }
    description { "This is a game description" }
    status { Game::STATUSES.sample }
  end
end
