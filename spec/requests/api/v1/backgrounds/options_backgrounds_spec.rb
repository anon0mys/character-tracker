require "rails_helper"

describe "GET /api/v1/backgrounds/options" do
  let(:user) { create(:user) }

  before { sign_in(user) }

  it "returns every background name, unpaginated" do
    create_list(:background, 25)

    get options_api_v1_backgrounds_path, headers: @auth_headers
    data = response.parsed_body["data"]
    expect(data.size).to eq 25
    expect(data.first.keys).to include("name", "source")
  end
end
