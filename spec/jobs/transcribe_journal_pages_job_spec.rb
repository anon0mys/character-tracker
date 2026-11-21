require "rails_helper"

RSpec.describe TranscribeJournalPagesJob do
  let(:game) { create(:game) }
  let(:import) do
    JournalPageImport.create!(game:, created_by: create(:user), page_count: 1).tap do |record|
      record.pages.create!(position: 0, content_type: "image/jpeg", data: "photo")
    end
  end

  it "stores the drafts and marks the import ready" do
    drafts = [{ "played_on" => "2022-07-23", "title" => "Decisions", "body" => "- notes" }]
    allow(JournalPageTranscriber).to receive(:call).and_return(drafts)

    described_class.perform_now(import.id)

    expect(import.reload).to be_ready
    expect(import.entries.first).to include("title" => "Decisions")
    expect(JournalPageTranscriber).to have_received(:call).with(hash_including(pages: import.pages.to_a))
  end

  it "fails the import with the transcriber's message" do
    allow(JournalPageTranscriber).to receive(:call).and_raise(JournalPageTranscriber::Error, "Claude declined")

    described_class.perform_now(import.id)

    expect(import.reload).to have_attributes(status: "failed", error: "Claude declined")
  end

  it "fails with a general message on anything unexpected" do
    allow(JournalPageTranscriber).to receive(:call).and_raise(RuntimeError, "boom")

    described_class.perform_now(import.id)

    expect(import.reload).to have_attributes(status: "failed", error: /Something went wrong/)
  end
end
