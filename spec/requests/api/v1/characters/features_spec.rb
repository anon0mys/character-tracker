require "rails_helper"

describe "character features (4e)" do
  let(:user) { create(:user) }
  let(:character) { create(:character, user:, archetype: "wizard", level: 3) }

  before { sign_in(user) }

  describe "GET index" do
    it "projects class features up to level as derived rows, with no id" do
      get api_v1_character_features_path(character), headers: @auth_headers
      expect(response).to have_http_status(:success)

      rows = response.parsed_body["data"].select { |r| r["category"] == "class" }
      expect(rows).not_to be_empty
      expect(rows.pluck("origin").uniq).to eq ["derived"]
      expect(rows.pluck("id").uniq).to eq [nil]
      expect(character.features.count).to eq 0
    end

    it "projects subclass features once the character has a matching subclass" do
      character.update!(subclass: "Necromancy")
      get api_v1_character_features_path(character), headers: @auth_headers
      rows = response.parsed_body["data"].select { |r| r["category"] == "subclass" }
      expect(rows).not_to be_empty
    end

    it "orders derived, then feats, then custom rows tagged by origin" do
      character.character_feats.create!(feat: create(:feat, name: "Alert"))
      character.features.create!(category: "blessing", name: "Boon of Luck")

      get api_v1_character_features_path(character), headers: @auth_headers
      origins = response.parsed_body["data"].pluck("origin")
      expect(origins.uniq).to eq %w[derived feat custom]
    end
  end

  it "creates, updates and deletes a custom feature" do
    post api_v1_character_features_path(character), headers: @auth_headers,
      params: { feature: { category: "feat", name: "Lucky", description: "reroll" } }, as: :json
    expect(response).to have_http_status(:success)
    expect(response.parsed_body["data"]["origin"]).to eq "custom"
    id = response.parsed_body["data"]["id"]

    patch api_v1_character_feature_path(character, id), headers: @auth_headers,
      params: { feature: { description: "three rerolls" } }, as: :json
    expect(response.parsed_body["data"]["description"]).to eq "three rerolls"

    delete api_v1_character_feature_path(character, id), headers: @auth_headers
    expect(character.features.where(id:)).to be_empty
  end
end
