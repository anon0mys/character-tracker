require "rails_helper"

describe "GET /api/v1/feats" do
  let(:user) { create(:user) }

  before { sign_in(user) }

  it "returns a paginated list of feats" do
    create_list(:feat, 3)

    get api_v1_feats_path, headers: @auth_headers
    expect(response).to have_http_status(:success)
    body = response.parsed_body
    expect(body["data"]).to be_present
    expect(body).to have_key("pages")
  end

  it "filters by name" do
    create(:feat, name: "Alert Test")
    create(:feat, name: "Tough Test")

    get "#{api_v1_feats_path}?name=alert", headers: @auth_headers
    names = response.parsed_body["data"].pluck("name")
    expect(names).to include("Alert Test")
    expect(names).not_to include("Tough Test")
  end

  it "exposes benefits" do
    create(:feat, name: "Benefits Test")
    get "#{api_v1_feats_path}?name=benefits", headers: @auth_headers
    feat = response.parsed_body["data"].first
    expect(feat["benefits"].first).to match(/surprised/)
  end
end
