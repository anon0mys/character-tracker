FactoryBot.define do
  factory :journal_entry do
    game
    title { "The vault under Saltmere" }
    played_on { Date.new(2026, 11, 5) }
  end
end
