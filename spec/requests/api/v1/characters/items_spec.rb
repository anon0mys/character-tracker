require "rails_helper"

describe "character items routes" do
  let(:user) { create(:user) }
  let(:character) { create(:character, user:) }

  before { sign_in(user) }

  describe "GET index" do
    it "lists the character's items with join quantity and item fields" do
      item = create(:item, name: "Infused Boots", requires_attunement: true)
      character.character_items.create!(item:, quantity: 2)

      get api_v1_character_items_path(character), headers: @auth_headers

      expect(response).to have_http_status(:success)
      row = response.parsed_body["data"].first
      expect(row["name"]).to eq "Infused Boots"
      expect(row["quantity"]).to eq 2
      expect(row["requires_attunement"]).to be true
    end

    it "does not expose another user's character items" do
      other_item = create(:item, name: "Someone Else's Blade")
      other = create(:character, user: create(:user))
      other.character_items.create!(item: other_item, quantity: 1)

      get api_v1_character_items_path(other), headers: @auth_headers

      expect(response).to have_http_status(:not_found)
      expect(response.body).not_to include("Someone Else's Blade")
    end
  end
end
