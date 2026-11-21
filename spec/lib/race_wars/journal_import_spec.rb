require "rails_helper"

RSpec.describe RaceWars::JournalImport do
  let(:game) { create(:game, name: "Race Wars") }
  let(:log) { StringIO.new }
  let!(:baal) { create(:character, game:, name: "Ba'al") }
  let!(:bothane) { create(:npc, game:, name: "Bothane") }
  let!(:mimic_cloak) { create(:item, name: "Mimic Cloak", homebrew: true) }
  let!(:halberd) { create(:item, name: "Halberd of Madness", homebrew: true) }

  before do
    create(:npc, game:, name: "Humans")
    create(:holding, game:, item: mimic_cloak)
    create(:holding, game:, item: halberd)
  end

  def run(replace: false, transcript: described_class::TRANSCRIPT)
    described_class.new(game:, replace:, log:, transcript:).call
  end

  def chips(entry)
    found = []
    walk = lambda do |node|
      found << node["attrs"].slice("type", "label") if node["type"].end_with?("Mention")
      Array(node["content"]).each(&walk)
    end
    walk.call(entry.body)
    found.uniq
  end

  it "writes one numbered entry per session, oldest first" do
    run

    entries = game.journal_entries.order(:number)
    expect(entries.count).to eq(34)
    expect(entries.first).to have_attributes(number: 1, title: "The Pit", played_on: Date.new(2021, 8, 28))
    expect(entries.last).to have_attributes(number: 34, title: "Skippin Town", played_on: Date.new(2024, 7, 18))
  end

  it "turns the notebook's spellings into chips for the campaign's people and items" do
    run

    chaos = game.journal_entries.find_by(title: "In Chaos")
    expect(chips(chaos)).to include(
      { "type" => "Character", "label" => "Ba'al" },
      { "type" => "Npc", "label" => "Bothane" },
      { "type" => "Item", "label" => "Halberd of Madness" },
    )
    expect(chaos.journal_mentions.pluck(:mentionable_type, :mentionable_id))
      .to include(["Character", baal.id], ["Npc", bothane.id], ["Item", halberd.id])
  end

  it "leaves groups and things the campaign doesn't hold as plain text" do
    run

    meeting = game.journal_entries.find_by(title: "The Meeting")
    expect(chips(meeting).pluck("label")).not_to include("Humans")
    loot = game.journal_entries.find_by(title: "On the Way Out")
    expect(chips(loot).pluck("label")).to include("Mimic Cloak")
    expect(chips(loot).pluck("label")).not_to include("Scroll of Geas")
  end

  it "nests sub-bullets and keeps headings and numbered lists" do
    importer = described_class.new(game:, log:)
    missed = importer.entries.find { |e| e.title.start_with?("Missed Session (") }
    body = importer.body_for(missed)

    list = body["content"].first
    expect(list["type"]).to eq("bulletList")
    numbered = list["content"].find { |li| li["content"].size > 1 }["content"].last
    expect(numbered["type"]).to eq("orderedList")
    expect(numbered["content"].size).to eq(3)

    meeting = importer.entries.find { |e| e.title == "The Meeting" }
    headings = importer.body_for(meeting)["content"].select { |b| b["type"] == "heading" }
    expect(headings.map { |h| h["content"].first["text"] }).to include("Temple of Kothar", "Land Bosses")
  end

  it "stores Yjs state the editor can open" do
    run

    entry = game.journal_entries.find_by(title: "The Pit")
    expect(entry.ydoc_state).to be_present
    expect(entry.ydoc_state.bytesize).to be > 100
  end

  it "leaves entries alone on a re-run unless asked to replace them" do
    run
    entry = game.journal_entries.find_by(title: "The Pit")
    entry.update!(body: { "type" => "doc", "content" => [] })

    expect { run }.not_to(change { game.journal_entries.pluck(:id, :body) })

    run(replace: true)
    expect(game.journal_entries.count).to eq(34)
    expect(entry.reload.body["content"]).not_to be_empty
  end
end
