require 'rails_helper'

RSpec.describe Location, type: :model do
  context 'validations' do
    it { should validate_presence_of :name }
  end

  context 'enums' do
    it do
      should define_enum_for(:location_type)
        .with_values(combine_to_hash(Location::LOCATION_TYPES))
        .backed_by_column_of_type(:string)
    end
  end

  context 'relationships' do
    it { should have_many(:factions).through(:faction_locations) }
    it { should have_many :npcs }
  end
end