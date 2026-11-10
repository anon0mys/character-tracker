require "rails_helper"

describe "/api/v1/games/:game_id/locations" do
  let(:user) { create(:user) }
  let(:game) { create(:game) }

  before do
    create(:user_game, user:, game:)
    sign_in(user)
  end

  it "lists and creates the campaign's places" do
    post api_v1_game_locations_path(game), headers: @auth_headers, params: { location: { name: "Home Base" } }
    create(:location, game: create(:game), name: "Elsewhere")
    get api_v1_game_locations_path(game), headers: @auth_headers

    expect(response.parsed_body["data"].pluck("name")).to eq(["Home Base"])
  end

  it "shows a place with where it sits and what is in it" do
    coast = create(:location, game:, name: "Sword Coast")
    waterdeep = create(:location, game:, name: "Waterdeep", parent: coast)
    create(:location, game:, parent: waterdeep)
    create(:npc, game:, location: waterdeep)
    create(:holding, game:, holder: waterdeep)

    get api_v1_game_location_path(game, waterdeep), headers: @auth_headers

    expect(response.parsed_body["data"]).to include(
      "parent_id" => coast.id, "parent_name" => "Sword Coast",
      "child_count" => 1, "npc_count" => 1, "holding_count" => 1
    )
  end

  it "moves a place inside another" do
    coast = create(:location, game:)
    waterdeep = create(:location, game:)

    patch api_v1_game_location_path(game, waterdeep), headers: @auth_headers, params: { location: { parent_id: coast.id } }

    expect(waterdeep.reload.parent).to eq(coast)
  end

  it "refuses to move a place inside itself" do
    coast = create(:location, game:)

    patch api_v1_game_location_path(game, coast), headers: @auth_headers, params: { location: { parent_id: coast.id } }

    expect(response).to have_http_status(:unprocessable_entity)
  end

  it "deletes a place, moving the places inside to the chosen place" do
    coast = create(:location, game:)
    waterdeep = create(:location, game:, parent: coast)
    flagon = create(:location, game:, parent: waterdeep)

    delete api_v1_game_location_path(game, waterdeep, children_to: coast.id), headers: @auth_headers

    expect(response).to have_http_status(:no_content)
    expect(flagon.reload.parent).to eq(coast)
  end

  it "deletes a place, moving the places inside to the top level" do
    waterdeep = create(:location, game:)
    flagon = create(:location, game:, parent: waterdeep)

    delete api_v1_game_location_path(game, waterdeep, children_to: "top"), headers: @auth_headers

    expect(flagon.reload.parent).to be_nil
  end

  it "won't touch another campaign's places" do
    elsewhere = create(:location, game: create(:game))

    delete api_v1_game_location_path(game, elsewhere), headers: @auth_headers

    expect(response).to have_http_status(:not_found)
    expect(Location.exists?(elsewhere.id)).to be(true)
  end
end
