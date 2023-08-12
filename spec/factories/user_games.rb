FactoryBot.define do
  factory :user_game do
    status { :active }
    role { :player }
    association :user
    association :game
  end
end