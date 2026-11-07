require "rails_helper"

RSpec.describe JournalMentionSync do
  let(:game) { create(:game) }
  let(:kai) { create(:character, game:, name: "Kai") }
  let(:wand) { create(:item, name: "Wand of Wonder") }
  let(:entry) { create(:journal_entry, game:) }

  def sync(body)
    entry.update!(body:)
    described_class.call(entry)
    entry.journal_mentions.order(:id)
  end

  it "records people and things with the block they appear in" do
    mentions = sync(journal_body([person(kai), " found a ", thing(wand), "."]))

    excerpt = "Kai found a Wand of Wonder."
    expected = [[kai, "Kai", excerpt], [wand, "Wand of Wonder", excerpt]]
    expect(mentions.map { |m| [m.mentionable, m.label, m.excerpt] }).to eq(expected)
  end

  it "keeps the first appearance of a repeated target" do
    mentions = sync(journal_body([thing(wand), " first."], [thing(wand), " again."]))

    expect(mentions.map(&:excerpt)).to eq(["Wand of Wonder first."])
  end

  it "skips unknown types and non-numeric ids" do
    rogue = { node: "thingMention", "type" => "User", "id" => 1, "label" => "x" }
    bad_id = { node: "thingMention", "type" => "Item", "id" => "1; drop", "label" => "y" }

    expect(sync(journal_body([rogue, bad_id]))).to be_empty
  end

  it "replaces earlier rows" do
    sync(journal_body([thing(wand)]))

    expect(sync(journal_body([person(kai)])).map(&:mentionable)).to eq([kai])
  end

  context "when a mentioned record is deleted" do
    let(:venna) { create(:character, game:, name: "Venna") }
    let(:body) { journal_body([person(venna), " and ", person(kai), " kept watch."]) }

    before do
      sync(body)
      venna.destroy!
    end

    it "drops the deleted record's row" do
      expect(entry.journal_mentions.reload.map(&:mentionable)).to eq([kai])
    end

    it "resyncs without trying to link it again" do
      expect(sync(body).map(&:mentionable)).to eq([kai])
    end

    it "reports the chip as missing" do
      expect(described_class.missing_targets(entry)).to eq([{ type: "Character", id: venna.id }])
    end
  end
end
