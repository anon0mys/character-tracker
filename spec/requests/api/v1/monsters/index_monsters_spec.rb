require "rails_helper"

describe "GET /api/v1/monsters" do
  let(:user) { create(:user) }

  before { sign_in(user) }

  it "returns a paginated list of monsters" do
    create_list(:monster, 3)
    create(:monster, name: "Aboleth Test")

    get api_v1_monsters_path, headers: @auth_headers
    expect(response).to have_http_status(:success)
    body = response.parsed_body
    expect(body["data"]).to be_present
    expect(body).to have_key("pages")
  end

  it "filters by name" do
    create(:monster, name: "Aboleth Test")
    create(:monster, name: "Kobold Test")

    get "#{api_v1_monsters_path}?name=aboleth", headers: @auth_headers
    names = response.parsed_body["data"].pluck("name")
    expect(names).to include("Aboleth Test")
    expect(names).not_to include("Kobold Test")
  end

  it "exposes the stat block" do
    create(:monster, name: "Statblock Test")
    get "#{api_v1_monsters_path}?name=statblock", headers: @auth_headers
    monster = response.parsed_body["data"].first
    expect(monster["stat_block"]["actions"].first["name"]).to eq "Bite"
  end
end
