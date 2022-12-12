require 'rails_helper'

describe 'PATCH /api/v1/characters/:character_id/spell_lists/:spell_list_id' do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let(:valid_attrs) {{
    spell_list: {
      name: 'Updated Name'
    }
  }}

  context 'as an authenticated user' do
    before { sign_in(user) }
    let(:character) { create(:character, user: user) }
    let(:spell_list) { create(:spell_list, character: character, name: 'Spellz') }
    before { patch api_v1_character_spell_list_path(character.id, spell_list.id),
              headers: @auth_headers,
              params: valid_attrs 
    }

    it 'updates a spell list for the character' do
      result = JSON.parse(response.body)
      expect(result['data']['name']).to eq('Updated Name')
    end
  end
end