require "rails_helper"

describe "character archetype wiring" do
  let(:user) { create(:user) }

  before { sign_in(user) }

  it "syncs archetype_id on save from the archetype name" do
    character = create(:character, user:, archetype: :wizard)
    expect(character.archetype_id).to eq Archetype.find_by(name: "wizard").id
    expect(character.archetype).to be_a(Archetype)
  end

  it "serializes subclass label, options and details for the archetype" do
    character = create(:character, user:, archetype: :wizard)

    get api_v1_character_path(character), headers: @auth_headers

    data = response.parsed_body["data"]
    expect(data["subclass_label"]).to eq "School"
    expect(data["subclass_options"]).to include("Necromancy")
    detail = data["subclass_details"].find { |d| d["name"] == "Necromancy" }
    expect(detail["description"]).to be_present
  end
end
