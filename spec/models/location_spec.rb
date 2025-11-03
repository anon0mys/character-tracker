require "rails_helper"

RSpec.describe Location do
  subject(:location) { build(:location) }

  context "validations" do
    it { is_expected.to validate_presence_of :name }
  end

  context "enums" do
    it do
      expect(location).to define_enum_for(:location_type)
        .with_values(combine_to_hash(Location::LOCATION_TYPES))
        .backed_by_column_of_type(:string)
    end
  end

  context "relationships" do
    it { is_expected.to have_many(:factions).through(:faction_locations) }
    it { is_expected.to have_many :npcs }
  end
end
