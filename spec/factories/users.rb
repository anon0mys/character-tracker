FactoryBot.define do
  factory :user do
    email { Faker::Internet.email }
    after(:build) do |u|
      u.password_confirmation = u.password = Faker::Internet.password unless u.password
    end
  end
end
