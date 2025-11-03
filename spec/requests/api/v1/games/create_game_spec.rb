require "rails_helper"

describe "POST /api/v1/games" do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let(:game_attrs) do
    {
      name: "Test Game",
      description: "Sweet campaign",
    }
  end

  context "as an authenticated user" do
    before { sign_in(user) }

    context "with valid params" do
      before { post api_v1_games_path, headers: @auth_headers, params: { game: game_attrs } }

      it "creates a new game for the user" do
        result = response.parsed_body
        expect(result["data"]["name"]).to eq("Test Game")
        expect(result["data"]["description"]).to eq("Sweet campaign")
        expect(result["data"]["start_date"]).to be_nil
      end
    end

    context "with valid params and start_date" do
      before { post api_v1_games_path, headers: @auth_headers, params: { game: game_attrs.merge(start_date: "2023-01-01") } }

      it "creates a new game for the user" do
        result = response.parsed_body
        expect(result["data"]["name"]).to eq("Test Game")
        expect(result["data"]["description"]).to eq("Sweet campaign")
        expect(result["data"]["start_date"]).to eq("2023-01-01T00:00:00.000Z")
      end
    end
  end
end
