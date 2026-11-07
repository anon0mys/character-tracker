require "rails_helper"

# Party members can read each other's sheets; only the owner can change one.
describe "viewing a party member's sheet" do
  let(:user) { create(:user) }
  let(:game) { create(:game) }
  let(:baal) { create(:character, game:, name: "Ba'al", user: create(:user)) }

  before do
    create(:user_game, user:, game:)
    sign_in(user)
  end

  it "shows the sheet, with its owner" do
    get api_v1_character_path(baal), headers: @auth_headers

    expect(response).to have_http_status(:ok)
    expect(response.parsed_body["data"]).to include("name" => "Ba'al", "user_id" => baal.user_id)
  end

  {
    features: :api_v1_character_features_path,
    spell_lists: :api_v1_character_spell_lists_path,
    trackers: :api_v1_character_character_trackers_path,
    attacks: :api_v1_character_attacks_path,
    loadouts: :api_v1_character_loadouts_path,
  }.each do |name, path|
    it "lists their #{name}" do
      get public_send(path, baal), headers: @auth_headers

      expect(response).to have_http_status(:ok)
    end
  end

  it "keeps a sheet from another campaign hidden" do
    stranger = create(:character, game: create(:game), user: create(:user))

    get api_v1_character_path(stranger), headers: @auth_headers

    expect(response).to have_http_status(:not_found)
  end

  it "does not let a dropped player look" do
    UserGame.find_by(user:, game:).update!(status: "dropped")

    get api_v1_character_path(baal), headers: @auth_headers

    expect(response).to have_http_status(:not_found)
  end

  it "does not let a party member change the sheet" do
    patch api_v1_character_path(baal), headers: @auth_headers, params: { character: { name: "Renamed" } }

    expect(response).to have_http_status(:not_found)
    expect(baal.reload.name).to eq("Ba'al")
  end

  it "does not let a party member add to the sheet" do
    post api_v1_character_attacks_path(baal), headers: @auth_headers, params: { attack: { name: "Sneaky" } }

    expect(response).to have_http_status(:not_found)
    expect(baal.attacks).to be_empty
  end

  it "requires a sign-in to list spell lists" do
    get api_v1_character_spell_lists_path(baal)

    expect(response).to have_http_status(:unauthorized)
  end
end
