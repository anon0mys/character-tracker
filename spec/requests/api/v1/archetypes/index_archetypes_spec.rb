require "rails_helper"

describe "GET /api/v1/archetypes" do
  let(:user) { create(:user) }

  before { sign_in(user) }

  it "lists archetypes with their subclass label and subclass names" do
    get api_v1_archetypes_path, headers: @auth_headers
    expect(response).to have_http_status(:success)
    wizard = response.parsed_body["data"].find { |a| a["name"] == "wizard" }
    expect(wizard["subclass_label"]).to eq "School"
    expect(wizard["subclasses"]).to include("Necromancy")
  end
end
