FactoryBot.define do
  factory :user do
    email { Faker::Internet.email }
    after(:build) do |u|
      if !u.password
        u.password_confirmation = u.password = Faker::Internet.password
      end
    end
  end
end
