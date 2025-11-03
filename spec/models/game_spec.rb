require "rails_helper"

RSpec.describe Game do
  subject(:game) { build(:game) }

  context "enums" do
    it do
      expect(game).to define_enum_for(:status)
        .with_values(combine_to_hash(Game::STATUSES))
        .backed_by_column_of_type(:string)
    end
  end

  context "relationships" do
    it { is_expected.to have_many(:users).through(:user_games) }
    it { is_expected.to have_many :characters }
  end
end
