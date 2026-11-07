require "rails_helper"

describe "GET /api/v1/games/:game_id/journal_mentions" do
  let(:user) { create(:user) }
  let(:game) { create(:game) }
  let(:other_game) { create(:game) }
  let(:wand) { create(:item, name: "Wand of Wonder") }

  before do
    create(:user_game, user:, game:)
    create(:user_game, user:, game: other_game)
    sign_in(user)
  end

  def entry_mentioning(record, game:, title:)
    create(:journal_entry, game:, title:, body: journal_body(["A ", thing(record), "."])).tap do |entry|
      JournalMentionSync.call(entry)
    end
  end

  it "lists this game's entries that mention the target, newest first" do
    older = entry_mentioning(wand, game:, title: "The magpie market")
    newer = entry_mentioning(wand, game:, title: "The vault")
    entry_mentioning(wand, game: other_game, title: "Elsewhere")

    get api_v1_game_journal_mentions_path(game), headers: @auth_headers, params: { type: "Item", id: wand.id }

    data = response.parsed_body["data"]
    expect(data.pluck("entry_id")).to eq([newer.id, older.id])
    expect(data.first).to include("title" => "The vault", "label" => "Wand of Wonder", "excerpt" => "A Wand of Wonder.")
  end

  it "lists entries that mention an NPC" do
    archivist = create(:npc, game:, name: "The Archivist", location: nil)
    entry = create(:journal_entry, game:, body: journal_body([person(archivist), " wants the crown back."]))
    JournalMentionSync.call(entry)

    get api_v1_game_journal_mentions_path(game), headers: @auth_headers, params: { type: "Npc", id: archivist.id }

    expect(response.parsed_body["data"]).to contain_exactly(
      include("entry_id" => entry.id, "excerpt" => "The Archivist wants the crown back."),
    )
  end

  it "rejects a type that cannot be mentioned" do
    get api_v1_game_journal_mentions_path(game), headers: @auth_headers, params: { type: "User", id: user.id }

    expect(response).to have_http_status(:bad_request)
  end
end
