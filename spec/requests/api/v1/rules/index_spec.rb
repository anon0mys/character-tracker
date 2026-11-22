require "rails_helper"

describe "GET /api/v1/rules" do
  let(:user) { create(:user) }

  it "returns every rule in reading order, with its markdown" do
    sign_in(user)
    create(:rule, name: "Conditions: Blinded", position: 2)
    create(:rule, name: "Cover", position: 1)

    get api_v1_rules_path, headers: @auth_headers

    expect(response).to have_http_status(:success)
    rules = response.parsed_body["data"]
    expect(rules.pluck("name")).to eq(["Cover", "Conditions: Blinded"])
    expect(rules.first).to include("category" => "Combat", "body" => a_string_including("half cover"))
  end

  it "needs a signed-in user" do
    get api_v1_rules_path
    expect(response).to have_http_status(:unauthorized)
  end
end
