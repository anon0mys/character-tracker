require "rails_helper"

RSpec.describe Background do
  context "validations" do
    it { is_expected.to validate_presence_of(:name) }

    it "requires a unique name" do
      create(:background, name: "Acolyte")
      expect(build(:background, name: "Acolyte")).not_to be_valid
    end
  end

  context "filtering" do
    it "filters by name and source" do
      create(:background, name: "Acolyte", source: "Player's Handbook")
      create(:background, name: "Fisher", source: "Ghosts of Saltmarsh")

      expect(described_class.filter(name: "aco").pluck(:name)).to eq ["Acolyte"]
      expect(described_class.filter(source: "saltmarsh").pluck(:name)).to eq ["Fisher"]
    end
  end
end
