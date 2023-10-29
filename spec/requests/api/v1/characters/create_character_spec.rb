require 'rails_helper'

describe 'POST /api/v1/characters' do
  let(:user) { create(:user) }
  let(:game) { create(:game) }
  let(:other_user) { create(:user) }
  let(:valid_attrs) {{
    character: {
      name: 'Kai',
      archetype: :artificer,
      game_id: game.id,
      race: 'Domesticae (Goat)',
      level: 5,
      background: 'Guild Artisan',
      alignment: 'CG',
      age: 38,
      speed: 30,
      initiative_bonus: 0,
      ac_bonus: 6,
      proficiencies: [:constitution, :intelligence],
      strength: 12,
      dexterity: 11,
      constitution: 14,
      intelligence: 16,
      wisdom: 10,
      charisma: 10,
    }
  }}

  context 'as an authenticated user' do
    before { sign_in(user) }
    before { post api_v1_characters_path, headers: @auth_headers, params: valid_attrs }

    it 'responds with a 201' do
      expect(response).to have_http_status(:success)
    end

    it 'creates a new character for the user' do
      result = JSON.parse(response.body)

      expect(user.characters.count).to eq 1
      expect(game.characters.count).to eq 1
    end

    it 'returns character data' do
      result = JSON.parse(response.body)
      expect(result['data']).to eq({
        "id" => Character.first.id,
        "ac" => 16,
        "age" => 38,
        "alignment" => "CG",
        "background" => "Guild Artisan",
        "class" => "Artificer",
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
        "charisma"=> {"modifier" => 0, "save" => 0, "value" => 10},
        "constitution"=> {"modifier" => 2, "save" => 5, "value" => 14},
        "dexterity"=> {"modifier" => 0, "save" => 0, "value" => 11},
        "intelligence"=> {"modifier" => 3, "save" => 6, "value" => 16},
        "strength"=> {"modifier" => 1, "save" => 1, "value" => 12},
        "wisdom"=> {"modifier" => 0, "save" => 0, "value" => 10}
      })
    end
  end
end
