require "rails_helper"

RSpec.describe RaceWars::Import do
  let(:game) { create(:game, name: "Race Wars") }
  let(:log) { StringIO.new }

  before do
    create(:character, game:, name: "Kai")
    create(:item, name: "Bag of Holding", description: "Source: Dungeon Master's Guide Wondrous item, uncommon")
    create(:item, name: "Ring of Protection", description: "Source: Dungeon Master's Guide Ring, rare")
    create(:item, name: "Boots of Striding and Springing", description: "Source: Dungeon Master's Guide Wondrous item")
  end

  def run(replace: false)
    described_class.new(game:, replace:, log:).call
  end

  it "brings in one holding per copy, splitting shared rows" do
    run

    # 124 rows: the Bag of Holding row becomes the container, and three rows
    # shared by several holders split into 3, 4 and 3 holdings.
    expect(game.holdings.count).to eq(131)
  end

  it "creates the players, their characters and the NPCs" do
    run

    expect(User.find_by(username: "Ba'al").email).to eq("baal@race-wars.invalid")
    pov = game.characters.find_by(name: "Pov")
    expect([pov[:archetype], pov.subclass, pov.level]).to eq(["druid", "Spores", 15])
    expect(game.npcs.find_by(name: "Oni").archetype).to eq("monk")
    expect(game.npcs.find_by(name: "Us")).to be_nil
    expect(game.locations.pluck(:name)).to contain_exactly("Home Base", "Bank Vault")
  end

  it "fills Ba'al's Bag of Holding" do
    run

    baal = game.characters.find_by(name: "Ba'al")
    bag = baal.holdings.joins(:item).find_by(items: { name: "Bag of Holding" })
    expect(bag.contents.count).to eq(22)
    expect(bag.contents.sum(:quantity)).to eq(34)
    expect(bag.contents.distinct.pluck(:status)).to eq(["stored"])
  end

  it "links published items and keeps the table's words as notes" do
    run

    rings = game.holdings.joins(:item).where(items: { name: "Ring of Protection" })
    expect(rings.count).to eq(3)
    expect(rings.pluck(:notes)).to include("+1 AC, +1 to all saves")
    expect(Item.where(name: "Ring of Protection").count).to eq(1)
    expect(game.holdings.joins(:item).where(items: { name: "Boots of Striding and Springing" }).pluck(:status))
      .to eq(["destroyed"])
  end

  it "makes homebrew items with a type and tags" do
    run

    expect(Item.find_by(name: "Wynmaw")).to have_attributes(
      homebrew: true, source: "Race Wars", item_type: "weapon", tags: ["magic item"],
    )
    expect(Item.find_by(name: "Halberd of Madness").quality).to eq("legendary")
  end

  it "leaves holdings alone on a re-run unless asked to replace them" do
    run
    game.holdings.first.update!(notes: "changed in the app")

    expect { run }.not_to(change { game.holdings.pluck(:id, :notes) })
    expect(User.where(username: "Pov").count).to eq(1)

    run(replace: true)
    expect(game.holdings.count).to eq(131)
    expect(game.holdings.where(notes: "changed in the app")).to be_empty
  end
end
