require "rails_helper"

describe "GET /api/v1/spells" do
  let(:user) { create(:user) }

  before do
    create_list(:spell, 49)
    create(:spell, name: "Spell of Search")
  end

  context "as an authenticated user" do
    before { sign_in(user) }

    context "with no filter" do
      it "returns a paginated list of spells", skip: "Flakey" do
        get api_v1_spells_path, headers: @auth_headers
        result = response.parsed_body
        spells = Spell.limit(20)
        expect(result["data"].count).to eq 20
        expect(result["data"][0]["id"]).to eq spells.first.id
        expect(result["data"][-1]["id"]).to eq spells.last.id
      end

      it "is able to return the next page", skip: "Flakey" do
        get "#{api_v1_spells_path}?page=2", headers: @auth_headers
        result = response.parsed_body
        spells = Spell.offset(20).limit(20)
        expect(result["data"].count).to eq 20
        expect(result["data"][0]["id"]).to eq spells.first.id
        expect(result["data"][-1]["id"]).to eq spells.last.id
      end

      it "returns pagination metadata" do
        get api_v1_spells_path, headers: @auth_headers
        result = response.parsed_body
        expect(result["page"]).to eq 1
        expect(result["prev"]).to be_nil
        expect(result["next"]).to eq 2
        expect(result["pages"]).to eq 3
      end
    end

    context "with filters" do
      it "filters by name" do
        get "#{api_v1_spells_path}?name=search", headers: @auth_headers
        result = response.parsed_body
        expect(result["data"].count).to eq Spell.where("name ILIKE ?", "%search%").count
      end

      it "filters by archetype" do
        get "#{api_v1_spells_path}?archetype=artificer", headers: @auth_headers
        result = response.parsed_body
        expect(result["data"].count).to eq Spell.where("archetypes && ?", "{artificer}").count
      end

      it "filters by multiple archetypes" do
        get "#{api_v1_spells_path}?archetype=artificer,cleric", headers: @auth_headers
        result = response.parsed_body
        expect(result["data"].count).to eq Spell.where("archetypes && ?", "{artificer,cleric}").limit(20).count
      end

      it "filters by level" do
        get "#{api_v1_spells_path}?level=cantrip", headers: @auth_headers
        result = response.parsed_body
        expect(result["data"].count).to eq Spell.where(level: "cantrip").count
      end

      it "filters by school" do
        get "#{api_v1_spells_path}?school=evocation", headers: @auth_headers
        result = response.parsed_body
        expect(result["data"].count).to eq Spell.where(school: "evocation").count
      end

      it "is able to combine filters" do
        create(:spell, school: "evocation", level: "9", archetypes: ["wizard"])
        get(
          "#{api_v1_spells_path}?school=evocation&archetype=wizard&level=9",
          headers: @auth_headers,
        )
        result = response.parsed_body
        expect(result["data"].count).to eq Spell
          .where(level: "9", school: "evocation")
          .where("archetypes && ?", "{wizard}")
          .count
      end
    end
  end
end
