require "rails_helper"

describe "GET /api/v1/characters/:id" do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }

  context "as an authenticated user" do
    let(:character) { create(:character, user:, name: "Kai") }

    before do
      sign_in(user)
      get api_v1_character_path(character.id), headers: @auth_headers
    end

    it "responds with a 201" do
      expect(response).to have_http_status(:success)
    end

    it "returns a character for the user" do
      result = response.parsed_body
      character = result["data"]
      expect(character).to eq({
        "id" => Character.first.id,
        "ac" => 10,
        "age" => 38,
        "alignment" => "Chaotic Good",
        "background" => "Guild Artisan",
        "archetype" => "Artificer",
        "proficiencies" => %w[constitution intelligence],
        "current_hitpoints" => 8,
        "total_hitpoints" => 8,
        "injury_condition" => "Healthy",
        "hit_die" => "d8",
        "current_spell_list" => nil,
        "concentration" => 2,
        "initiative" => 0,
        "level" => 1,
        "name" => "Kai",
        "perception" => 10,
        "proficiency_bonus" => 2,
        "race" => "Domesticae (Goat)",
        "speed" => 30,
        "spell_attack_mod" => 2,
        "spell_save_dc" => 10,
        "charisma" => { "modifier" => 0, "save" => 0, "value" => 10 },
        "constitution" => { "modifier" => 0, "save" => 2, "value" => 10 },
        "dexterity" => { "modifier" => 0, "save" => 0, "value" => 10 },
        "intelligence" => { "modifier" => 0, "save" => 2, "value" => 10 },
        "strength" => { "modifier" => 0, "save" => 0, "value" => 10 },
        "wisdom" => { "modifier" => 0, "save" => 0, "value" => 10 },
      })
    end
  end
end
