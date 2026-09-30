require "rails_helper"

describe "PATCH /api/v1/characters/:id combat state (4c)" do
  let(:user) { create(:user) }
  let(:character) { create(:character, user:) }

  before { sign_in(user) }

  it "persists conditions, spell_slots_used and death saves" do
    patch api_v1_character_path(character),
      headers: @auth_headers,
      params: { character: {
        conditions: %w[Concentrating Haste],
        spell_slots_used: { "1" => 2, "3" => 1 },
        death_save_successes: 2,
        death_save_failures: 1,
        temp_hitpoints: 13,
      } },
      as: :json

    expect(response).to have_http_status(:success)
    data = response.parsed_body["data"]
    expect(data["conditions"]).to eq %w[Concentrating Haste]
    expect(data["spell_slots_used"]).to eq({ "1" => 2, "3" => 1 })
    expect(data["death_save_successes"]).to eq 2
    expect(data["temp_hitpoints"]).to eq 13
  end
end
