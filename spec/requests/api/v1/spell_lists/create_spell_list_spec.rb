require 'rails_helper'

describe 'POST /api/v1/characters/:character_id/spell_lists' do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let(:valid_attrs) {{
    spell_list: {
      name: 'Spellz'
    }
  }}

  context 'as an authenticated user' do
    before { sign_in(user) }
    let(:character) { create(:character, user: user) }
    before { post api_v1_character_spell_lists_path(character.id),
              headers: @auth_headers,
              params: valid_attrs 
    }

    it 'creates a new spell list for the character' do
      result = JSON.parse(response.body)
      expect(result['data']['name']).to eq('Spellz')
    end
  end
end