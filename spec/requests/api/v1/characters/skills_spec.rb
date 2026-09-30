require "rails_helper"

describe "character skills (4d)" do
  let(:user) { create(:user) }

  before { sign_in(user) }

  it "serializes computed skills with proficiency and expertise bonuses" do
    character = create(:character, user:, level: 13, intelligence: 20)
    character.proficiencies = ["arcana"]
    character.expertise = ["arcana"]
    character.save!

    get api_v1_character_path(character), headers: @auth_headers

    skills = response.parsed_body["data"]["skills"]
    arcana = skills.find { |s| s["name"] == "Arcana" }
    # INT +5, proficiency +5 (lvl13), expertise +5
    expect(arcana["modifier"]).to eq 15
    expect(arcana["proficient"]).to be true
    expect(arcana["expertise"]).to be true
  end

  it "persists and serializes custom skills" do
    character = create(:character, user:, level: 13, intelligence: 20)

    patch api_v1_character_path(character),
      headers: @auth_headers,
      params: { character: { custom_skills: [{ name: "Alchemy", ability: "intelligence", proficient: true, expertise: false }] } },
      as: :json

    expect(response).to have_http_status(:success)
    skills = response.parsed_body["data"]["skills"]
    alchemy = skills.find { |s| s["name"] == "Alchemy" }
    expect(alchemy).to be_present
    expect(alchemy["custom"]).to be true
    expect(alchemy["modifier"]).to eq 10
  end
end
