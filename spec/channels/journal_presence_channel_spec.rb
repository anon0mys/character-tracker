require "rails_helper"

RSpec.describe JournalPresenceChannel do
  let(:user) { create(:user) }
  let(:game) { create(:game) }

  before do
    create(:user_game, user:, game:)
    stub_connection current_user: user
  end

  it "rejects someone outside the campaign" do
    subscribe(game_id: create(:game).id)

    expect(subscription).to be_rejected
  end

  it "broadcasts who is writing in which entry" do
    entry = create(:journal_entry, game:)
    subscribe(game_id: game.id)

    expect { perform :present, entry_id: entry.id, name: "Venna" }
      .to have_broadcasted_to(game).with(entry_id: entry.id, user_id: user.id, name: "Venna")
  end

  it "ignores entries in other games" do
    subscribe(game_id: game.id)

    expect { perform :present, entry_id: create(:journal_entry).id, name: "Venna" }.not_to have_broadcasted_to(game)
  end
end
