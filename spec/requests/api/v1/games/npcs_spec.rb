require "rails_helper"

describe "/api/v1/games/:game_id/npcs and /locations" do
  let(:user) { create(:user) }
  let(:game) { create(:game) }

  before do
    create(:user_game, user:, game:)
    sign_in(user)
  end

  it "lists the campaign's NPCs with what they carry" do
    oni = create(:npc, game:, name: "Oni", archetype: "monk", location: nil)
    create(:holding, game:, holder: oni)
    create(:npc, game: create(:game), name: "Elsewhere")

    get api_v1_game_npcs_path(game), headers: @auth_headers

    expect(response.parsed_body["data"]).to contain_exactly(
      include("name" => "Oni", "archetype" => "monk", "holding_count" => 1),
    )
  end

  it "creates an NPC with no class" do
    post api_v1_game_npcs_path(game), headers: @auth_headers, params: { npc: { name: "Ashawn" } }

    expect(response).to have_http_status(:created)
    expect(game.npcs.pluck(:name, :archetype)).to eq([["Ashawn", nil]])
  end

  it "updates an NPC" do
    npc = create(:npc, game:, name: "Bothane", location: nil)

    patch api_v1_game_npc_path(game, npc), headers: @auth_headers, params: { npc: { archetype: "paladin" } }

    expect(npc.reload.archetype).to eq("paladin")
  end

  it "lists and creates the campaign's places" do
    post api_v1_game_locations_path(game), headers: @auth_headers, params: { location: { name: "Home Base" } }
    get api_v1_game_locations_path(game), headers: @auth_headers

    expect(response.parsed_body["data"].pluck("name")).to eq(["Home Base"])
  end
end
