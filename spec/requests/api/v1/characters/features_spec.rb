require "rails_helper"

describe "character features (4e)" do
  let(:user) { create(:user) }
  let(:character) { create(:character, user:, archetype: "wizard", level: 3) }

  before { sign_in(user) }

  it "imports class features up to level, without duplicates" do
    expect do
      post import_class_api_v1_character_features_path(character), headers: @auth_headers
    end.to change { character.features.where(category: "class").count }.from(0).to(be > 0)

    before_count = character.features.count
    post import_class_api_v1_character_features_path(character), headers: @auth_headers
    expect(character.features.count).to eq before_count
  end

  it "creates, updates and deletes a feature" do
    post api_v1_character_features_path(character), headers: @auth_headers,
      params: { feature: { category: "feat", name: "Lucky", description: "reroll" } }, as: :json
    expect(response).to have_http_status(:success)
    id = response.parsed_body["data"]["id"]

    patch api_v1_character_feature_path(character, id), headers: @auth_headers,
      params: { feature: { description: "three rerolls" } }, as: :json
    expect(response.parsed_body["data"]["description"]).to eq "three rerolls"

    delete api_v1_character_feature_path(character, id), headers: @auth_headers
    expect(character.features.where(id:)).to be_empty
  end

  describe "POST import_subclass" do
    it "seeds subclass features for the character's subclass" do
      character = create(:character, user:, archetype: :wizard)
      character.update!(subclass: "Necromancy")

      expect do
        post import_subclass_api_v1_character_features_path(character), headers: @auth_headers
      end.to change { character.features.where(category: "subclass").count }.by_at_least(1)
      expect(response).to have_http_status(:success)

      before_count = character.features.count
      post import_subclass_api_v1_character_features_path(character), headers: @auth_headers
      expect(character.features.count).to eq before_count
    end

    it "422 when no matching subclass" do
      character = create(:character, user:, archetype: :wizard)
      post import_subclass_api_v1_character_features_path(character), headers: @auth_headers
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end
