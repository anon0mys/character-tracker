require "rails_helper"

RSpec.describe Item do
  subject(:item) { build(:item) }

  context "validations" do
    context "enums" do
      it do
        expect(item).to define_enum_for(:item_type)
          .with_values(combine_to_hash(Item::ITEM_TYPES))
          .backed_by_column_of_type(:string)
      end
    end
  end

  context "relationships" do
    it { is_expected.to have_many(:holdings).dependent(:restrict_with_error) }
  end

  context "source" do
    it "reads the book from a published description" do
      item = create(:item, description: "Source: Dungeon Master's Guide Wondrous item, rare While you wear...")

      expect(item.source).to eq "Dungeon Master's Guide"
    end

    it "leaves homebrew sources alone" do
      item = create(:item, homebrew: true, source: "Race Wars", description: "Source: Somewhere Ring, rare")

      expect(item.source).to eq "Race Wars"
    end
  end

  context "scopes" do
    it "filters by name" do
      create(:item, name: "Bag")
      create(:item, name: "Bigger Bag")
      create(:item, name: "Sword")

      expect(described_class.name_eq("sword").count).to eq 1
      expect(described_class.name_eq("bag").count).to eq 2
    end

    it "filters by homebrew" do
      create(:item, homebrew: true)
      create(:item, homebrew: true)
      create(:item, homebrew: false)

      expect(described_class.homebrew_eq("true").count).to eq 2
      expect(described_class.homebrew_eq("false").count).to eq 1
    end

    it "filters by tag" do
      create(:item, tags: ["magic item", "bag"])
      create(:item, tags: ["magic item"])
      create(:item, tags: [])

      expect(described_class.tag_eq("magic item").count).to eq 2
      expect(described_class.tag_eq("bag").count).to eq 1
    end

    it "filters by item type" do
      create(:item, item_type: "arcane")
      create(:item, item_type: "arcane")
      create(:item, item_type: "weapon")

      expect(described_class.item_type_eq("arcane").count).to eq 2
      expect(described_class.item_type_eq("weapon").count).to eq 1
      expect(described_class.item_type_eq("gear").count).to eq 0
    end

    it "filters by item quality" do
      create(:item, quality: "rare")
      create(:item, quality: "very_rare")
      create(:item, quality: "common")
      create(:item, quality: "common")

      expect(described_class.quality_eq("common").count).to eq 2
      expect(described_class.quality_eq("rare").count).to eq 1
      expect(described_class.quality_eq("legendary").count).to eq 0
    end
  end
end
