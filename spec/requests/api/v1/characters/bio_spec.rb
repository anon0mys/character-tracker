require "rails_helper"

describe "character bio (4f)" do
  let(:user) { create(:user) }
  let(:character) { create(:character, user:) }

  before { sign_in(user) }

  it "persists subclass, bio prose and languages" do
    patch api_v1_character_path(character), headers: @auth_headers,
      params: { character: {
        subclass: "Armorer", trait: "Curious", ideal: "Knowledge",
        flaw: "Reckless", bond: "My workshop", languages: %w[Common Draconic]
      } }, as: :json

    expect(response).to have_http_status(:success)
    data = response.parsed_body["data"]
    expect(data["subclass"]).to eq "Armorer"
    expect(data["trait"]).to eq "Curious"
    expect(data["languages"]).to eq %w[Common Draconic]
  end
end
