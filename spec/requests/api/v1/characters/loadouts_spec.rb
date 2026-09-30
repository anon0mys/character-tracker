require "rails_helper"

describe "character loadouts (4h)" do
  let(:user) { create(:user) }
  let(:character) { create(:character, user:) }

  before { sign_in(user) }

  it "creates a loadout and activating one deactivates the rest" do
    a = character.loadouts.create!(name: "Guardian", active: true, modifiers: { "ac_bonus" => 1 })
    b = character.loadouts.create!(name: "Infiltrator", active: false, modifiers: { "speed_bonus" => 5 })

    post activate_api_v1_character_loadout_path(character, b), headers: @auth_headers
    expect(response).to have_http_status(:success)

    expect(a.reload.active).to be false
    expect(b.reload.active).to be true
  end

  it "reflects the active loadout's ac bonus in the character serializer" do
    get api_v1_character_path(character), headers: @auth_headers
    base_ac = response.parsed_body["data"]["ac"]

    loadout = character.loadouts.create!(name: "Guardian", active: true, modifiers: { "ac_bonus" => 2 })

    get api_v1_character_path(character), headers: @auth_headers
    data = response.parsed_body["data"]
    expect(data["ac"]).to eq base_ac + 2
    expect(data["active_loadout_id"]).to eq loadout.id
  end
end
