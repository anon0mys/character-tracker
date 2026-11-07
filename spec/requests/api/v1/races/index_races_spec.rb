require "rails_helper"

describe "GET /api/v1/races" do
  let(:user) { create(:user) }

  before { sign_in(user) }

  it "returns a paginated list of races" do
    create_list(:race, 3)

    get api_v1_races_path, headers: @auth_headers
    expect(response).to have_http_status(:success)
    body = response.parsed_body
    expect(body["data"]).to be_present
    expect(body).to have_key("pages")
  end

  it "filters by name" do
    create(:race, name: "Dwarf Test")
    create(:race, name: "Kobold Test")

    get "#{api_v1_races_path}?name=dwarf", headers: @auth_headers
    names = response.parsed_body["data"].pluck("name")
    expect(names).to include("Dwarf Test")
    expect(names).not_to include("Kobold Test")
  end

  it "exposes traits and subraces" do
    create(:race, name: "Traits Test", subraces: [{ "name" => "Hill", "description" => "", "traits" => [] }])
    get "#{api_v1_races_path}?name=traits", headers: @auth_headers
    race = response.parsed_body["data"].first
    expect(race["traits"].first["name"]).to eq "Darkvision"
    expect(race["subraces"].first["name"]).to eq "Hill"
  end
end
