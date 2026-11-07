require "rails_helper"

RSpec.describe JournalEntryChannel do
  let(:user) { create(:user) }
  let(:game) { create(:game) }
  let(:entry) { create(:journal_entry, game:) }
  let(:encode) { ->(bytes) { Base64.strict_encode64(bytes) } }

  before do
    create(:user_game, user:, game:)
    stub_connection current_user: user
  end

  it "rejects someone outside the campaign" do
    stub_connection current_user: create(:user)
    subscribe(entry_id: entry.id)

    expect(subscription).to be_rejected
  end

  it "sends the snapshot and every update after it on join" do
    entry.append_update!("one")
    entry.store_snapshot!(state: "S", body: {}, through_seq: 1)
    entry.append_update!("two")

    subscribe(entry_id: entry.id)

    expect(subscription).to have_stream_for(entry)
    expect(transmissions.last).to eq("type" => "init", "state" => encode.call("S"), "compacted_through" => 1,
      "updates" => [[2, encode.call("two")]])
  end

  it "logs an update and broadcasts it with its seq" do
    subscribe(entry_id: entry.id)

    expect { perform :update, update: encode.call("u"), from: "tab-1" }
      .to have_broadcasted_to(entry).with(type: "update", update: encode.call("u"), seq: 1, from: "tab-1")
    expect(entry.pending_updates.pluck(:payload)).to eq(["u"])
  end

  it "relays awareness without storing it" do
    subscribe(entry_id: entry.id)

    expect { perform :awareness, update: "cursor", from: "tab-1" }
      .to have_broadcasted_to(entry).with(type: "awareness", update: "cursor", from: "tab-1")
    expect(JournalEntryUpdate.count).to eq(0)
  end

  it "stores a snapshot and compacts the log" do
    subscribe(entry_id: entry.id)
    2.times { perform :update, update: encode.call("u"), from: "tab-1" }

    perform :snapshot, state: encode.call("S"), body: { "type" => "doc" }, through_seq: 2

    expect(entry.reload.slice(:ydoc_state, :compacted_through)).to eq("ydoc_state" => "S", "compacted_through" => 2)
    expect(entry.pending_updates).to be_empty
  end
end
