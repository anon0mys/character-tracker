require "rails_helper"

describe "API error handling" do
  let(:user) { create(:user) }

  before { sign_in(user) }

  it "returns 404 (not 500) for a missing record" do
    get api_v1_character_path(999_999), headers: @auth_headers
    expect(response).to have_http_status(:not_found)
    expect(response.parsed_body["error_type"]).to eq "RecordNotFound"
  end
end
