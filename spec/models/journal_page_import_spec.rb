require "rails_helper"

RSpec.describe JournalPageImport do
  include ActiveSupport::Testing::TimeHelpers

  let(:game) { create(:game) }
  let(:user) { create(:user) }
  let!(:baal) { create(:character, game:, name: "Ba'al") }

  def import(**)
    described_class.create!(game:, created_by: user, status: "ready", **).tap do |record|
      record.pages.create!(position: 0, content_type: "image/jpeg", data: "photo")
    end
  end

  def draft(played_on, title, body = "- notes")
    { "played_on" => played_on, "date_estimated" => false, "title" => title, "body" => body,
      "unreadable" => [], "pages" => [1] }
  end

  describe "#confirm!" do
    it "adds the drafts to the journal oldest first, with links, then drops the photos" do
      record = import(entries: [draft("2022-08-06", "In Chaos", "- Ba'al plucks out an eyeball"),
                                draft("2022-07-23", "Decisions")])

      created = record.confirm!

      expect(created.map(&:title)).to eq(["Decisions", "In Chaos"])
      expect(created.map(&:number)).to eq([1, 2])
      expect(created.last.journal_mentions.pluck(:mentionable_id)).to eq([baal.id])
      expect(created.last.ydoc_state).to be_present
      expect(record.reload).to be_done
      expect(record.pages).to be_empty
    end

    it "needs a date on every draft" do
      record = import(entries: [draft(nil, "Missed Session")])

      expect { record.confirm! }.to raise_error(ActiveRecord::RecordInvalid, /needs a date/)
      expect(game.journal_entries).to be_empty
    end

    it "only adds a ready import" do
      record = import(status: "transcribing", entries: [draft("2022-07-23", "Decisions")])

      expect { record.confirm! }.to raise_error(described_class::NotReady)
    end
  end

  it "keeps only the known keys of edited drafts" do
    record = import(entries: [draft("2022-07-23", "Decisions").merge("extra" => "x")])

    expect(record.entries.first.keys).to match_array(described_class::ENTRY_KEYS)
  end

  it "treats a transcription that never finished as failed, so it can be retried" do
    record = import(status: "transcribing")
    travel 20.minutes

    expect(record).to be_retryable
    expect(record.display_status).to eq("failed")
    expect(record.display_error).to match(/interrupted/)
  end
end
