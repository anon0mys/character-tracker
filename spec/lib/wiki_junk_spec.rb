require "rails_helper"
require Rails.root.join("lib/wiki_junk")

describe WikiJunk do
  let(:junk) do
    " window['nitroAds'].createAd('wad-dnd5e-below-content', { \"refreshTime\": 30 }); " \
      "Help | Terms of Service | Privacy Powered by Wikidot.com"
  end

  it "cuts everything from the ad call on, in strings, arrays and hashes" do
    expect(described_class.clean("Turns to dust.#{junk}")).to eq("Turns to dust.")
    expect(described_class.clean([{ "description" => "Long rest.#{junk}" }, "Fine"]))
      .to eq([{ "description" => "Long rest." }, "Fine"])
    expect(described_class.clean(3)).to eq(3)
  end

  it "reports junk in the database, and cleans it only when asked" do
    item = create(:item, description: "Turns to dust.#{junk}")
    subclass = Subclass.create!(archetype: Archetype.find_by(name: "wizard"), name: "Junk Test",
      features: [{ "name" => "Lore", "description" => "Long rest.#{junk}" }])

    expect(described_class.scrub!(dry_run: true)).to include("items.description" => 1, "subclasses.features" => 1)
    expect(item.reload.description).to include("nitroAds")

    described_class.scrub!(dry_run: false)
    expect(item.reload.description).to eq("Turns to dust.")
    expect(subclass.reload.features).to eq([{ "name" => "Lore", "description" => "Long rest." }])
    expect(described_class.scrub!(dry_run: true)).to be_empty
  end

  it "is not in any seed file" do
    dirty = Rails.root.glob("lib/seeds/*.json").select { |file| file.read.include?(described_class::MARKER) }
    expect(dirty).to be_empty
  end
end
