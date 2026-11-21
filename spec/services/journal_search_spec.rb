require "rails_helper"

RSpec.describe JournalSearch do
  let(:game) { create(:game) }

  def entry(title, *paragraphs)
    create(:journal_entry, game:, title:, body: journal_body(*paragraphs.map { |text| [text] }))
  end

  def search(text, scope: game.journal_entries)
    described_class.call(scope, text).to_a
  end

  it "finds entries by any word in their text, with stemming" do
    cellar = entry("Spider Cellar", "Creepy spider carvings scare Ba'al")
    entry("Back to Town", "Ba'al squishes an eye")

    expect(search("carving")).to eq([cellar])
    expect(search("spiders")).to eq([cellar])
  end

  it "needs every word, and matches the last one as a prefix" do
    pit = entry("The Pit", "The library researching blood magic")
    entry("Get Out", "The blood mixes in the pools")

    expect(search("blood magi")).to eq([pit])
    expect(search("bl")).to contain_exactly(pit, game.journal_entries.find_by(title: "Get Out"))
    expect(search("ma blood")).to be_empty
  end

  it "ranks a title match above a match in the text" do
    mention = entry("Back to Town", "Rist goes to the Raven Queen Temple")
    titled = entry("Raven Queen Temple", "We visit the triplets")

    expect(search("raven queen")).to eq([titled, mention])
  end

  it "marks the matched words in a snippet" do
    entry("Decisions", "We get a map from the old lion", "Rist loses a finger gambling")

    snippet = search("gambling").first.snippet
    expect(snippet).to include("#{described_class::HIGHLIGHT[0]}gambling#{described_class::HIGHLIGHT[1]}")
  end

  it "finds nothing for a query with no words, and stays within the scope" do
    entry("The Pit", "blood magic")
    create(:journal_entry, title: "Elsewhere", body: journal_body(["blood magic"]))

    expect(search("  ?! ")).to be_empty
    expect(search("blood").map(&:title)).to eq(["The Pit"])
  end

  it "keeps up with edits to the body" do
    pit = entry("The Pit", "blood magic")
    pit.update!(body: journal_body(["a fight in the ring"]))

    expect(search("blood")).to be_empty
    expect(search("ring")).to eq([pit])
  end
end
