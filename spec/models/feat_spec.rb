require "rails_helper"

RSpec.describe Feat do
  context "validations" do
    it { is_expected.to validate_presence_of(:name) }

    it "requires a unique name" do
      create(:feat, name: "Alert")
      expect(build(:feat, name: "Alert")).not_to be_valid
    end
  end

  context "filtering" do
    it "filters by name and source" do
      create(:feat, name: "Alert", source: "Player's Handbook")
      create(:feat, name: "Chef", source: "Tasha's Cauldron of Everything")

      expect(described_class.filter(name: "ale").pluck(:name)).to eq ["Alert"]
      expect(described_class.filter(source: "tasha").pluck(:name)).to eq ["Chef"]
    end
  end
end
