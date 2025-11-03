require "rails_helper"

describe "DELETE /api/v1/characters/:id" do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }

  context "as an authenticated user" do
    let(:character) { create(:character, user:, name: "Test Char") }

    before do
      sign_in(user)
      delete api_v1_character_path(character.id), headers: @auth_headers
    end

    it "delete a character for the user" do
      expect(response).to have_http_status(:accepted)
    end
  end
end
