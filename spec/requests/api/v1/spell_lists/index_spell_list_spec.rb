require "rails_helper"

describe "GET /api/v1/characters/:character_id/spell_lists" do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }

  context "as an authenticated user" do
    let(:character) { create(:character, user:, name: "Test Char") }

    before do
      create_list(:spell_list, 2, character:)
      sign_in(user)
      get api_v1_character_spell_lists_path(character.id), headers: @auth_headers
    end

    it "returns a list of spell lists for the character" do
      result = response.parsed_body
      expect(result["data"].length).to eq 2
    end
  end
end
