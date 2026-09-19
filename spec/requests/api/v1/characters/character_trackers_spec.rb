require "rails_helper"

describe "character_trackers routes" do
  let(:user) { create(:user) }
  let(:character) { create(:character, user:) }

  before { sign_in(user) }

  describe "GET index" do
    it "lists trackers for the character" do
      create(:character_tracker, character:, name: "Flash of Genius")
      get api_v1_character_character_trackers_path(character), headers: @auth_headers
      expect(response).to have_http_status(:success)
      expect(response.parsed_body["data"].first["name"]).to eq "Flash of Genius"
    end
  end

  describe "POST create" do
    it "creates a tracker" do
      post api_v1_character_character_trackers_path(character),
        headers: @auth_headers,
        params: { character_tracker: { name: "Defensive Field", max_uses: 5, reset_on: "long_rest" } }
      expect(response).to have_http_status(:success)
      expect(character.character_trackers.count).to eq 1
    end

    it "returns 422 on invalid data" do
      post api_v1_character_character_trackers_path(character),
        headers: @auth_headers,
        params: { character_tracker: { name: "", max_uses: 3, reset_on: "long_rest" } }
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe "PATCH update" do
    it "updates current_uses" do
      tracker = create(:character_tracker, character:, max_uses: 3, current_uses: 0)
      patch api_v1_character_character_tracker_path(character, tracker),
        headers: @auth_headers,
        params: { character_tracker: { current_uses: 2 } }
      expect(response).to have_http_status(:success)
      expect(tracker.reload.current_uses).to eq 2
    end
  end

  describe "DELETE" do
    it "destroys the tracker" do
      tracker = create(:character_tracker, character:)
      delete api_v1_character_character_tracker_path(character, tracker), headers: @auth_headers
      expect(character.character_trackers.count).to eq 0
    end
  end
end
