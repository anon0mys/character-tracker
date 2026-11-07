require "rails_helper"

RSpec.describe HoldingMove do
  let(:game) { create(:game) }
  let(:baal) { create(:character, game:, name: "Ba'al") }
  let(:pov) { create(:character, game:, name: "Pov") }
  let(:beans) { create(:item, name: "Bag O' Beans") }
  let(:bag) { create(:holding, game:, holder: baal) }

  it "moves a whole pile" do
    pile = create(:holding, game:, item: beans, holder: baal, quantity: 9)

    moved = described_class.new(pile, holder: pov).call

    expect(moved).to eq(pile)
    expect(moved.reload).to have_attributes(holder: pov, quantity: 9)
  end

  it "splits a pile, leaving the rest behind" do
    pile = create(:holding, game:, item: beans, holder: bag, quantity: 9, status: "stored")

    moved = described_class.new(pile, holder: pov, quantity: 1).call

    expect(pile.reload.quantity).to eq(8)
    expect(moved).to have_attributes(holder: pov, quantity: 1, status: "carried")
  end

  it "merges into a matching pile at the destination" do
    pile = create(:holding, game:, item: beans, holder: baal, quantity: 3)
    theirs = create(:holding, game:, item: beans, holder: pov, quantity: 2)

    moved = described_class.new(pile, holder: pov).call

    expect(moved).to eq(theirs)
    expect(theirs.reload.quantity).to eq(5)
    expect(Holding.exists?(pile.id)).to be false
  end

  it "keeps piles with notes apart" do
    pile = create(:holding, game:, item: beans, holder: baal, quantity: 3, notes: "the cursed ones")
    create(:holding, game:, item: beans, holder: pov, quantity: 2)

    moved = described_class.new(pile, holder: pov).call

    expect(moved).to eq(pile)
    expect(pov.holdings.count).to eq(2)
  end

  it "stores things put into a place or container" do
    pile = create(:holding, game:, item: beans, holder: baal, status: "equipped")
    vault = create(:location, game:, name: "Bank Vault")

    expect(described_class.new(pile, holder: vault).call.status).to eq("stored")
  end

  it "refuses to move more than the pile holds" do
    pile = create(:holding, game:, item: beans, holder: baal, quantity: 2)

    expect { described_class.new(pile, holder: pov, quantity: 3).call }
      .to raise_error(ActiveRecord::RecordInvalid)
    expect(pile.reload.quantity).to eq(2)
  end
end
