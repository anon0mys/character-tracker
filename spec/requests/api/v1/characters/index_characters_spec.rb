require "rails_helper"

describe "GET /api/v1/characters" do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let(:other_characters) { create_list(:character, 2, user: other_user) }

  context "as an authenticated user" do
    before do
      create_list(:character, 2, user:)
      create_list(:character, 2, user: other_user)
      sign_in(user)
      get api_v1_characters_path, headers: @auth_headers
    end

    it "responds with a 200" do
      expect(response).to have_http_status(:success)
    end

    it "returns a list of characters" do
      result = response.parsed_body
      response_ids = result["data"].pluck("id")
      expect(response_ids).to eq(user.characters.pluck(:id))
    end

    it "does not return characters belonging to other users" do
      result = response.parsed_body
      response_ids = result["data"].pluck("id")
      expect(response_ids).not_to include(other_user.characters.pluck(:id))
    end
  end

  context "as a visitor" do
    before { get api_v1_characters_path, headers: @auth_headers }

    it "as 401 status" do
      expect(response).to have_http_status :unauthorized
    end
  end
end
