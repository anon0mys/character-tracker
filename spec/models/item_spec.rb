require "rails_helper"

RSpec.describe Item do
  subject(:item) { build(:item) }

  context "validations" do
    context "enums" do
      it do
        expect(item).to define_enum_for(:status)
          .with_values(combine_to_hash(Item::STATUSES))
          .backed_by_column_of_type(:string)
      end

      it do
        expect(item).to define_enum_for(:item_type)
          .with_values(combine_to_hash(Item::ITEM_TYPES))
          .backed_by_column_of_type(:string)
      end
    end
  end

  context "relationships" do
    it { is_expected.to have_many(:characters).through(:character_items) }
  end

  context "scopes" do
    it "filters by name" do
      create(:item, name: "Bag")
      create(:item, name: "Bigger Bag")
      create(:item, name: "Sword")

      expect(described_class.name_eq("sword").count).to eq 1
      expect(described_class.name_eq("bag").count).to eq 2
    end

    it "filters by status" do
      create(:item, status: "sold")
      create(:item, status: "stored")
      create(:item, status: "stored")

      expect(described_class.status_eq("stored").count).to eq 2
      expect(described_class.status_eq("sold").count).to eq 1
      expect(described_class.status_eq("equipped").count).to eq 0
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
