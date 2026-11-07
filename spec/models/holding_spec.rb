require "rails_helper"

RSpec.describe Holding do
  let(:game) { create(:game) }
  let(:baal) { create(:character, game:, name: "Ba'al") }

  context "relationships" do
    subject { build(:holding) }

    it { is_expected.to belong_to :game }
    it { is_expected.to belong_to :item }
    it { is_expected.to belong_to(:holder).optional }
    it { is_expected.to have_many(:contents).dependent(:nullify) }
  end

  context "validations" do
    it "allows no holder (not placed)" do
      expect(build(:holding, game:, holder: nil)).to be_valid
    end

    it "keeps a holder from another campaign out" do
      outsider = create(:character, game: create(:game))

      holding = build(:holding, game:, holder: outsider)

      expect(holding).not_to be_valid
      expect(holding.errors[:holder]).to include("must be in the same campaign")
    end

    it "rejects a negative quantity but keeps an empty pile" do
      expect(build(:holding, game:, quantity: -1)).not_to be_valid
      expect(build(:holding, game:, quantity: 0)).to be_valid
    end

    it "cannot be put inside itself or something inside it" do
      bag = create(:holding, game:, holder: baal)
      pouch = create(:holding, game:, holder: bag)

      bag.holder = pouch

      expect(bag).not_to be_valid
      expect(bag.errors[:holder]).to be_present
    end
  end

  context "status" do
    it "splits held from gone" do
      kept = create(:holding, game:, status: "equipped")
      sold = create(:holding, game:, status: "sold")

      expect(described_class.held).to eq([kept])
      expect(described_class.gone).to eq([sold])
      expect(sold).to be_gone
    end

    it "does not shadow ActiveRecord's destroyed?" do
      holding = create(:holding, game:, status: "destroyed")

      expect(holding.destroyed?).to be false
      expect(holding).to be_status_destroyed
    end
  end

  context "containers" do
    it "lets go of its contents when it is deleted" do
      bag = create(:holding, game:, holder: baal)
      beans = create(:holding, game:, holder: bag, quantity: 9)

      bag.destroy!

      expect(beans.reload.holder).to be_nil
      expect(beans.holder_type).to be_nil
    end
  end
end
