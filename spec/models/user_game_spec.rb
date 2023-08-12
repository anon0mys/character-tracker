require 'rails_helper'

RSpec.describe UserGame, type: :model do
  context 'validations' do
    it { should validate_uniqueness_of(:user_id).scoped_to(:game_id) }
  end

  context 'enums' do
    it do
      should define_enum_for(:status)
        .with_values(combine_to_hash(UserGame::STATUSES))
        .backed_by_column_of_type(:string)
    end

    it do
      should define_enum_for(:role)
        .with_values(combine_to_hash(UserGame::ROLES))
        .backed_by_column_of_type(:string)
    end
  end
end