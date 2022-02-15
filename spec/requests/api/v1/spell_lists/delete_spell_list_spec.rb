require 'rails_helper'

describe 'GET /api/v1/characters/:character_id/spell_lists/:spell_list_id' do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }

  context 'as an authenticated user' do
    let(:character) { create(:character, user: user, name: 'Test Char') }
    let(:spell_list) { create(:spell_list, character: character) }
    before { sign_in(user) }
    before { delete api_v1_character_spell_list_path(character.id, spell_list.id), headers: @auth_headers }

    it 'returns a spell list for the character' do
      expect(response).to have_http_status(:accepted)
    end
  end
end