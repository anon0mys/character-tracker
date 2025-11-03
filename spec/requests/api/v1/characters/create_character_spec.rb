require "rails_helper"

describe "POST /api/v1/characters" do
  let(:user) { create(:user) }
  let(:game) { create(:game) }
  let(:other_user) { create(:user) }
  let(:valid_attrs) do
    {
      character: {
        name: "Kai",
        archetype: :artificer,
        game_id: game.id,
        race: "Domesticae (Goat)",
        level: 5,
        background: "Guild Artisan",
        alignment: "CG",
        age: 38,
        speed: 30,
        initiative_bonus: 0,
        ac_bonus: 6,
        proficiencies: %i[constitution intelligence],
        strength: 12,
        dexterity: 11,
        constitution: 14,
        intelligence: 16,
        wisdom: 10,
        charisma: 10,
      },
    }
  end

  context "as an authenticated user" do
    before do
      sign_in(user)
      post api_v1_characters_path, headers: @auth_headers, params: valid_attrs
    end

    it "responds with a 201" do
      expect(response).to have_http_status(:success)
    end

    it "creates a new character for the user" do
      response.parsed_body

      expect(user.characters.count).to eq 1
      expect(game.characters.count).to eq 1
    end

    it "returns character data" do
      result = response.parsed_body
      expect(result["data"]).to eq({
        "id" => Character.first.id,
        "ac" => 16,
        "age" => 38,
        "alignment" => "Chaotic Good",
        "background" => "Guild Artisan",
        "archetype" => "Artificer",
        "proficiencies" => %w[constitution intelligence],
        "current_hitpoints" => 50,
        "total_hitpoints" => 50,
        "injury_condition" => "Healthy",
        "hit_die" => "d8",
        "current_spell_list" => nil,
        "concentration" => 5,
        "initiative" => 0,
        "level" => 5,
        "name" => "Kai",
        "perception" => 10,
        "proficiency_bonus" => 3,
        "race" => "Domesticae (Goat)",
        "speed" => 30,
        "spell_attack_mod" => 6,
        "spell_save_dc" => 14,
        "charisma" => { "modifier" => 0, "save" => 0, "value" => 10 },
        "constitution" => { "modifier" => 2, "save" => 5, "value" => 14 },
        "dexterity" => { "modifier" => 0, "save" => 0, "value" => 11 },
        "intelligence" => { "modifier" => 3, "save" => 6, "value" => 16 },
        "strength" => { "modifier" => 1, "save" => 1, "value" => 12 },
        "wisdom" => { "modifier" => 0, "save" => 0, "value" => 10 },
      })
    end
  end
end
