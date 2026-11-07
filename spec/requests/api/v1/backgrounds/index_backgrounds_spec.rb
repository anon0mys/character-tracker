require "rails_helper"

describe "GET /api/v1/backgrounds" do
  let(:user) { create(:user) }

  before { sign_in(user) }

  it "returns a paginated list of backgrounds" do
    create_list(:background, 3)

    get api_v1_backgrounds_path, headers: @auth_headers
    expect(response).to have_http_status(:success)
    body = response.parsed_body
    expect(body["data"]).to be_present
    expect(body).to have_key("pages")
  end

  it "filters by name" do
    create(:background, name: "Acolyte Test")
    create(:background, name: "Sage Test")

    get "#{api_v1_backgrounds_path}?name=acolyte", headers: @auth_headers
    names = response.parsed_body["data"].pluck("name")
    expect(names).to include("Acolyte Test")
    expect(names).not_to include("Sage Test")
  end

  it "exposes features and characteristics" do
    create(:background, name: "Features Test")
    get "#{api_v1_backgrounds_path}?name=features", headers: @auth_headers
    background = response.parsed_body["data"].first
    expect(background["features"].first["name"]).to eq "Shelter of the Faithful"
    expect(background["characteristics"]["ideals"]).to eq ["Tradition."]
  end
end
