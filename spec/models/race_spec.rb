require "rails_helper"

RSpec.describe Race do
  context "validations" do
    it { is_expected.to validate_presence_of(:name) }

    it "requires a unique name" do
      create(:race, name: "Dwarf")
      expect(build(:race, name: "Dwarf")).not_to be_valid
    end
  end

  context "filtering" do
    it "filters by name, category and size" do
      create(:race, name: "Hill Dwarf", category: "Standard", size: "Medium")
      create(:race, name: "Kobold", category: "Monstrous", size: "Small")

      expect(described_class.filter(name: "dwarf").pluck(:name)).to eq ["Hill Dwarf"]
      expect(described_class.filter(category: "Monstrous").pluck(:name)).to eq ["Kobold"]
      expect(described_class.filter(size: "Small").pluck(:name)).to eq ["Kobold"]
    end
  end
end
