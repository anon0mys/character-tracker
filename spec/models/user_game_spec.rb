require "rails_helper"

RSpec.describe UserGame do
  subject(:user_game) { build(:user_game) }

  context "validations" do
    it { is_expected.to validate_uniqueness_of(:user_id).scoped_to(:game_id) }
  end

  context "enums" do
    it do
      expect(user_game).to define_enum_for(:status)
        .with_values(combine_to_hash(UserGame::STATUSES))
        .backed_by_column_of_type(:string)
    end

    it do
      expect(user_game).to define_enum_for(:role)
        .with_values(combine_to_hash(UserGame::ROLES))
        .backed_by_column_of_type(:string)
    end
  end
end
