require "rails_helper"

RSpec.describe JournalEntry do
  let(:game) { create(:game) }

  describe "numbering" do
    it "numbers entries per game, starting at 1" do
      first = create(:journal_entry, game:)
      second = create(:journal_entry, game:)
      other = create(:journal_entry)

      expect([first.number, second.number, other.number]).to eq([1, 2, 1])
    end

    it "keeps an explicit number" do
      expect(create(:journal_entry, game:, number: 31).number).to eq(31)
    end

    it "rejects a duplicate number in the same game" do
      create(:journal_entry, game:, number: 4)
      expect(build(:journal_entry, game:, number: 4)).not_to be_valid
    end

    it "defaults played_on to today" do
      expect(create(:journal_entry, game:, played_on: nil).played_on).to eq(Date.current)
    end
  end

  describe "#append_update!" do
    it "hands out gapless seqs per entry" do
      entry = create(:journal_entry, game:)
      seqs = 3.times.map { |i| entry.append_update!("u#{i}") }

      expect(seqs).to eq([1, 2, 3])
      expect(entry.reload.update_seq).to eq(3)
      expect(entry.pending_updates.pluck(:payload)).to eq(%w[u0 u1 u2])
    end
  end

  describe "#store_snapshot!" do
    let(:entry) { create(:journal_entry, game:) }
    let(:spell) { create(:spell) }

    before { 3.times { |i| entry.append_update!("u#{i}") } }

    it "stores state and body, drops covered updates and syncs mentions" do
      stored = entry.store_snapshot!(state: "S", body: journal_body(["Cast ", thing(spell)]), through_seq: 2)

      expect(stored).to be(true)
      expect(entry.reload.ydoc_state).to eq("S")
      expect(entry.compacted_through).to eq(2)
      expect(entry.pending_updates.pluck(:seq)).to eq([3])
      expect(entry.journal_mentions.pluck(:mentionable_type, :mentionable_id)).to eq([["Spell", spell.id]])
    end

    it "ignores a snapshot older than the stored one" do
      entry.store_snapshot!(state: "new", body: {}, through_seq: 3)

      expect(entry.store_snapshot!(state: "old", body: {}, through_seq: 1)).to be(false)
      expect(entry.reload.ydoc_state).to eq("new")
    end

    it "never claims more updates than exist" do
      entry.store_snapshot!(state: "S", body: {}, through_seq: 99)

      expect(entry.reload.compacted_through).to eq(3)
    end
  end
end
