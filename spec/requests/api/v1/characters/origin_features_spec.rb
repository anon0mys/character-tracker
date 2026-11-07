require "rails_helper"

describe "race / background derivation and chosen feats" do
  let(:user) { create(:user) }
  let!(:race) do
    create(:race, name: "Dwarf",
      traits: [{ "name" => "Darkvision", "description" => "See in the dark." }],
      subraces: [{ "name" => "Hill Dwarf", "description" => "", "traits" => [{ "name" => "Dwarven Toughness", "description" => "+1 HP." }] }],
      alternate_versions: [{ "source" => "Eberron", "description" => "", "traits" => [],
                             "subraces" => [{ "name" => "Mark of Warding", "description" => "", "traits" => [{ "name" => "Warder's Intuition", "description" => "d4." }] }] }])
  end
  let!(:background) do
    create(:background, name: "Entertainer",
      features: [{ "name" => "By Popular Demand", "description" => "Perform." }],
      variants: [{ "name" => "Gladiator", "description" => "Fight." }])
  end
  let(:character) { create(:character, user:, race: "dwarf", background: "Entertainer", subrace: "Hill Dwarf") }

  before { sign_in(user) }

  it "syncs race_id and background_id from the name strings on save" do
    expect(character.race_record).to eq race
    expect(character.background_record).to eq background

    character.update!(race: "Unknown Homebrew")
    expect(character.reload.race_id).to be_nil
  end

  it "serializes race_details and background_details on the character" do
    get api_v1_character_path(character), headers: @auth_headers
    body = response.parsed_body["data"]
    expect(body["subrace"]).to eq "Hill Dwarf"
    expect(body["race_details"]["subraces"]).to eq ["Hill Dwarf", "Mark of Warding"]
    expect(body["race_details"]["traits"].first["name"]).to eq "Darkvision"
    expect(body["background_details"]["features"].first["name"]).to eq "By Popular Demand"
  end

  describe "GET features" do
    let(:names) { response.parsed_body["data"].pluck("name") }

    it "derives base traits plus the chosen subrace's traits" do
      get api_v1_character_features_path(character), headers: @auth_headers
      racial = response.parsed_body["data"].select { |r| r["category"] == "racial" }
      expect(racial.pluck("name")).to contain_exactly("Darkvision", "Dwarven Toughness")
      expect(racial.pluck("origin").uniq).to eq ["derived"]
    end

    it "finds subraces from alternate versions" do
      character.update!(subrace: "mark of warding")
      get api_v1_character_features_path(character), headers: @auth_headers
      expect(names).to include("Warder's Intuition")
    end

    it "derives nothing racial when the race is not in the compendium" do
      character.update!(race: "Homebrew")
      get api_v1_character_features_path(character), headers: @auth_headers
      expect(response.parsed_body["data"].pluck("category")).not_to include("racial")
    end

    it "derives background features and variants" do
      get api_v1_character_features_path(character), headers: @auth_headers
      background = response.parsed_body["data"].select { |r| r["category"] == "background" }
      expect(background.pluck("name")).to contain_exactly("By Popular Demand", "Gladiator")
    end
  end

  describe "character feats" do
    let(:feat) do
      create(:feat, name: "Heavily Armored", prerequisite: "Medium armor", description: "Train.",
        benefits: ["+1 Strength", "Heavy armor proficiency"])
    end

    it "adds a feat as a reference and renders it as a feat row" do
      post api_v1_character_feats_path(character), headers: @auth_headers,
        params: { feat_id: feat.id }, as: :json
      expect(response).to have_http_status(:success)
      row = response.parsed_body["data"]
      expect(row["origin"]).to eq "feat"
      expect(row["category"]).to eq "feat"
      expect(row["feat_id"]).to eq feat.id
      expect(row["description"]).to eq "Prerequisite: Medium armor\nTrain.\n• +1 Strength\n• Heavy armor proficiency"
      expect(character.feats).to contain_exactly(feat)
      expect(character.features.count).to eq 0
    end

    it "rejects the same feat twice" do
      character.character_feats.create!(feat:)
      post api_v1_character_feats_path(character), headers: @auth_headers,
        params: { feat_id: feat.id }, as: :json
      expect(response).to have_http_status(:unprocessable_entity)
    end

    it "removes a chosen feat" do
      character_feat = character.character_feats.create!(feat:)
      delete api_v1_character_feat_path(character, character_feat), headers: @auth_headers
      expect(response).to have_http_status(:accepted)
      expect(character.reload.feats).to be_empty
    end

    it "does not touch another user's character" do
      other = create(:character, user: create(:user))
      post api_v1_character_feats_path(other), headers: @auth_headers,
        params: { feat_id: feat.id }, as: :json
      expect(response).to have_http_status(:not_found)
    end
  end
end
