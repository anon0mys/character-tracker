require "rails_helper"

RSpec.describe Monster do
  context "validations" do
    it { is_expected.to validate_presence_of(:name) }

    it "requires a unique name" do
      create(:monster, name: "Aboleth")
      expect(build(:monster, name: "Aboleth")).not_to be_valid
    end
  end

  context "filtering" do
    it "filters by name, type and challenge rating" do
      create(:monster, name: "Ancient Dragon", creature_type: "Dragon", challenge_rating: "20")
      create(:monster, name: "Goblin", creature_type: "Humanoid", challenge_rating: "1/4")

      expect(described_class.filter(name: "dragon").pluck(:name)).to eq ["Ancient Dragon"]
      expect(described_class.filter(creature_type: "Humanoid").pluck(:name)).to eq ["Goblin"]
      expect(described_class.filter(challenge_rating: "20").pluck(:name)).to eq ["Ancient Dragon"]
    end
  end
end
