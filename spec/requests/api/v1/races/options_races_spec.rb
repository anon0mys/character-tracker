require "rails_helper"

describe "GET /api/v1/races/options" do
  let(:user) { create(:user) }

  before { sign_in(user) }

  it "returns every race with its subrace names, unpaginated" do
    create(:race, name: "Zed", subraces: [{ "name" => "Zed Prime", "description" => "", "traits" => [] }])
    create_list(:race, 25)

    get options_api_v1_races_path, headers: @auth_headers
    data = response.parsed_body["data"]
    expect(data.size).to eq 26
    zed = data.find { |r| r["name"] == "Zed" }
    expect(zed["subraces"]).to eq ["Zed Prime"]
    expect(zed["speed"]).to eq 30
  end
end
