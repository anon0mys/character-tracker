require "rails_helper"

describe "POST /api/v1/characters/:character_id/attacks" do
  let(:user) { create(:user) }
  let(:character) { create(:character, user:) }

  before { sign_in(user) }

  it "creates (not updates) an attack for the character" do
    expect do
      post api_v1_character_attacks_path(character),
        headers: @auth_headers,
        params: { attack: { name: "Armored Gauntlets", bonus: "+10", damage: "1d8+7", description: "bludgeoning" } }
    end.to change { character.attacks.count }.by(1)

    expect(response).to have_http_status(:success)
    expect(response.parsed_body["data"]["name"]).to eq "Armored Gauntlets"
  end

  it "does not create an attack on another user's character" do
    other = create(:character, user: create(:user))

    post api_v1_character_attacks_path(other),
      headers: @auth_headers,
      params: { attack: { name: "Sneaky", bonus: "+5", description: "no" } }

    expect(response).not_to have_http_status(:success)
    expect(other.attacks.count).to eq 0
  end

  it "persists riders, action_type and extra_attack" do
    post api_v1_character_attacks_path(character),
      headers: @auth_headers,
      params: { attack: {
        name: "Fire Launcher", bonus: "+10", damage: "1d6+7 fire", description: "ranged",
        action_type: "bonus", extra_attack: true,
        riders: [{ name: "Bonus burst", tag: "fire", damage: "1d6 fire", note: "once per round" }]
      } }

    expect(response).to have_http_status(:success)
    data = response.parsed_body["data"]
    expect(data["action_type"]).to eq "bonus"
    expect(data["extra_attack"]).to be true
    expect(data["riders"].first["name"]).to eq "Bonus burst"
  end
end
