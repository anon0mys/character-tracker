require "rails_helper"

describe "party visibility (Phase 5)" do
  let(:owner) { create(:user) }
  let(:viewer) { create(:user) }
  let(:game) { create(:game) }
  let!(:kai) { create(:character, user: owner, game:, name: "Kai") }

  before do
    owner.user_games.create!(game:, status: :active, role: :admin)
  end

  it "a fellow party member sees the whole party with HP and can read, not edit, another's sheet" do
    viewer.user_games.create!(game:, status: :active, role: :player)
    sign_in(viewer)

    get "#{api_v1_characters_path}?game_id=#{game.id}", headers: @auth_headers
    party = response.parsed_body["data"]
    row = party.find { |c| c["name"] == "Kai" }
    expect(row).to be_present
    expect(row["current_hitpoints"]).to be_present
    expect(row["user_id"]).to eq owner.id

    # viewer can read Kai's sheet, but changing it stays owner-only
    get api_v1_character_path(kai), headers: @auth_headers
    expect(response).to have_http_status(:success)

    patch api_v1_character_path(kai), headers: @auth_headers, params: { character: { name: "Not Kai" } }
    expect(response).not_to have_http_status(:success)
    expect(kai.reload.name).to eq "Kai"
  end

  it "a non-member only sees their own characters" do
    sign_in(viewer)
    get "#{api_v1_characters_path}?game_id=#{game.id}", headers: @auth_headers
    expect(response.parsed_body["data"]).to be_empty
  end
end
