FactoryBot.define do
  factory :user_game do
    status { UserGame::STATUSES.sample }
    role { 'player' }
    association :user
    association :game
  end
end