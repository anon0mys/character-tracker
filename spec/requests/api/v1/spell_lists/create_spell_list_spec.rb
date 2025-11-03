require "rails_helper"

describe "POST /api/v1/characters/:character_id/spell_lists" do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let(:valid_attrs) do
    {
      spell_list: {
        name: "Spellz",
      },
    }
  end

  context "as an authenticated user" do
    before do
      sign_in(user)
      post api_v1_character_spell_lists_path(character.id),
        headers: @auth_headers,
        params: valid_attrs
    end

    let(:character) { create(:character, user:) }

    it "creates a new spell list for the character" do
      result = response.parsed_body
      expect(result["data"]["name"]).to eq("Spellz")
    end
  end
end
