require 'rails_helper'

describe 'GET /api/v1/characters/:id' do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }

  context 'as an authenticated user' do
    let(:character) { create(:character, :with_sheet, user: user, name: 'Kai') }
    before { sign_in(user) }
    before { get api_v1_character_path(character.id), headers: @auth_headers }

    it 'returns a character for the user' do
      result = JSON.parse(response.body)
      expect(result['data']['name']).to eq('Kai')
    end

    it 'returns the character sheet for the character' do
      result = JSON.parse(response.body)

      character_sheet = result['data']['character_sheet']
      expect(character_sheet['name']).to eq('Kai')
      expect(character_sheet['race']).to eq('Domesticae (Goat)')
      expect(character_sheet['class']).to eq('Artificer')
      expect(character_sheet['level']).to eq(5)
      expect(character_sheet['background']).to eq('Guild Artisan')
      expect(character_sheet['alignment']).to eq('CG')
      expect(character_sheet['age']).to eq(38)
      expect(character_sheet['ac']).to eq(16)
      expect(character_sheet['initiative']).to eq(0)
      expect(character_sheet['speed']).to eq(30)
      expect(character_sheet['perception']).to eq(10)
      expect(character_sheet['proficiency_bonus']).to eq(3)
      expect(character_sheet['spell_attack_mod']).to eq(6)
      expect(character_sheet['spell_save_dc']).to eq(14)
      expect(character_sheet['concentration']).to eq(5)

      ability_scores = character_sheet['ability_scores']

      expect(ability_scores['strength']).to eq({'value' => 12, 'modifier' => 1, 'save' => 1})
      expect(ability_scores['dexterity']).to eq({'value' => 11, 'modifier' => 0, 'save' => 0})
      expect(ability_scores['constitution']).to eq({'value' => 14, 'modifier' => 2, 'save' => 5})
      expect(ability_scores['intelligence']).to eq({'value' => 16, 'modifier' => 3, 'save' => 6})
      expect(ability_scores['wisdom']).to eq({'value' => 10, 'modifier' => 0, 'save' => 0})
      expect(ability_scores['charisma']).to eq({'value' => 10, 'modifier' => 0, 'save' => 0})
    end
  end
end