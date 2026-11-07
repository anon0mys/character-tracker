require "rails_helper"

describe "/api/v1/games/:game_id/journal_entries" do
  let(:user) { create(:user) }
  let(:game) { create(:game) }
  let(:outsider_game) { create(:game) }

  before do
    create(:user_game, user:, game:)
    sign_in(user)
  end

  describe "GET index" do
    it "lists the game's entries newest first, with a preview and link count" do
      kai = create(:character, game:, name: "Kai")
      older = create(:journal_entry, game:, title: "Ashfall road")
      newer = create(:journal_entry, game:, title: "The vault", body: journal_body(["", person(kai)]))
      JournalMentionSync.call(newer)

      get api_v1_game_journal_entries_path(game), headers: @auth_headers

      data = response.parsed_body["data"]
      expect(data.pluck("id")).to eq([newer.id, older.id])
      expect(data.first["mention_count"]).to eq(1)
      expect(data.first["preview"]["content"].last["attrs"]["label"]).to eq("Kai")
    end
  end

  describe "POST create" do
    it "numbers the entry after the last one" do
      create(:journal_entry, game:, number: 30)

      post api_v1_game_journal_entries_path(game), headers: @auth_headers,
        params: { journal_entry: { title: "The vault" } }

      expect(response).to have_http_status(:created)
      expect(response.parsed_body["data"]).to include("number" => 31, "title" => "The vault",
        "played_on" => Date.current.iso8601, "previous" => include("number" => 30))
    end
  end

  describe "GET show" do
    it "includes the entry's links" do
      wand = create(:item, name: "Wand of Wonder")
      entry = create(:journal_entry, game:, body: journal_body([thing(wand)]))
      JournalMentionSync.call(entry)

      get api_v1_game_journal_entry_path(game, entry), headers: @auth_headers

      expect(response.parsed_body["data"]["mentions"]).to eq([{ "type" => "Item", "id" => wand.id, "label" => "Wand of Wonder" }])
    end
  end

  describe "PATCH update" do
    it "changes the title and date" do
      entry = create(:journal_entry, game:)

      patch api_v1_game_journal_entry_path(game, entry), headers: @auth_headers,
        params: { journal_entry: { title: "Renamed", played_on: "2026-11-01" } }

      expect(entry.reload.slice(:title, :played_on)).to eq("title" => "Renamed", "played_on" => Date.new(2026, 11, 1))
    end
  end

  describe "DELETE destroy" do
    it "removes the entry and its log" do
      entry = create(:journal_entry, game:)
      entry.append_update!("u")

      delete api_v1_game_journal_entry_path(game, entry), headers: @auth_headers

      expect(response).to have_http_status(:accepted)
      expect(JournalEntryUpdate.count).to eq(0)
    end
  end

  context "when the user is not in the game" do
    it "returns 404 for its journal" do
      get api_v1_game_journal_entries_path(outsider_game), headers: @auth_headers

      expect(response).to have_http_status(:not_found)
    end

    it "returns 404 for an entry reached through their own game" do
      entry = create(:journal_entry, game: outsider_game)

      get api_v1_game_journal_entry_path(game, entry), headers: @auth_headers

      expect(response).to have_http_status(:not_found)
    end
  end
end
