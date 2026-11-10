require "rails_helper"

RSpec.describe LocationRemoval do
  let(:game) { create(:game) }
  let(:coast) { create(:location, game:, name: "Sword Coast") }
  let(:waterdeep) { create(:location, game:, name: "Waterdeep", parent: coast) }
  let(:flagon) { create(:location, game:, name: "The Gilded Flagon", parent: waterdeep) }

  it "moves the places inside, whole, to the chosen place" do
    sword = create(:holding, game:, holder: flagon, status: "stored")
    durnan = create(:npc, game:, location: flagon)

    described_class.new(waterdeep, children_to: coast).call

    expect(Location.exists?(waterdeep.id)).to be(false)
    expect(flagon.reload.parent).to eq(coast)
    expect(sword.reload.holder).to eq(flagon)
    expect(durnan.reload.location).to eq(flagon)
  end

  it "moves the places inside to the top level" do
    flagon

    described_class.new(waterdeep, children_to: nil).call

    expect(flagon.reload.parent).to be_nil
  end

  it "frees items stored here, keeping what is inside them" do
    bag = create(:holding, game:, holder: waterdeep, status: "stored")
    rope = create(:holding, game:, holder: bag, status: "stored")

    described_class.new(waterdeep, children_to: coast).call

    expect(bag.reload).to have_attributes(holder: nil, status: "stored")
    expect(rope.reload.holder).to eq(bag)
  end

  it "frees NPCs here" do
    volo = create(:npc, game:, location: waterdeep)

    described_class.new(waterdeep, children_to: coast).call

    expect(volo.reload.location).to be_nil
  end

  it "refuses to move the places inside into the place being deleted" do
    flagon

    expect { described_class.new(waterdeep, children_to: flagon).call }
      .to raise_error(ActiveRecord::RecordInvalid)
    expect(Location.exists?(waterdeep.id)).to be(true)
  end
end
