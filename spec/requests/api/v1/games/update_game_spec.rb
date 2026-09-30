require "rails_helper"

describe "PATCH /api/v1/games/:id (4g)" do
  let(:user) { create(:user) }
  let(:game) { create(:game) }

  before do
    user.user_games.create!(game:, status: :active, role: :admin)
    sign_in(user)
  end

  it "updates status and hp_thresholds" do
    patch api_v1_game_path(game), headers: @auth_headers,
      params: { game: { status: "finished", hp_thresholds: { bloodied: 0.6, mangled: 0.3 } } }, as: :json

    expect(response).to have_http_status(:success)
    data = response.parsed_body["data"]
    expect(data["status"]).to eq "finished"
    expect(data["hp_thresholds"]).to eq({ "bloodied" => 0.6, "mangled" => 0.3 })
  end

  it "drives a character's injury_condition off the game thresholds" do
    game.update!(hp_thresholds: { bloodied: 0.9, mangled: 0.5 })
    character = create(:character, user:, game:)
    character.update!(current_hitpoints: 1) # far below mangled

    get api_v1_character_path(character), headers: @auth_headers
    expect(response.parsed_body["data"]["injury_condition"]).to eq "Mangled"
  end
end
