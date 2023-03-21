require 'rails_helper'

RSpec.describe Game, type: :model do
  context 'enums' do
    it do
      should define_enum_for(:status)
        .with_values(combine_to_hash(Game::STATUSES))
        .backed_by_column_of_type(:string)
    end
  end

  context 'relationships' do
    it { should have_many(:users).through(:user_games) }
    it { should have_many :characters }
  end
end