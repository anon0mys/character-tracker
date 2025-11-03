FactoryBot.define do
  factory :user_game do
    status { :active }
    role { :player }
    user
    game
  end
end
