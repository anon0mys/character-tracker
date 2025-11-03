require "rails_helper"

RSpec.describe Faction do
  context "validations" do
    it { is_expected.to validate_presence_of :name }
  end

  context "relationships" do
    it { is_expected.to have_many(:locations).through(:faction_locations) }
    it { is_expected.to have_many(:npcs).through(:faction_npcs) }
  end
end
