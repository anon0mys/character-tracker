require 'rails_helper'

describe 'GET /api/v1/characters/:character_id/spell_lists' do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }

  context 'as an authenticated user' do
    let(:character) { create(:character, user: user, name: 'Test Char') }
    before { create_list(:spell_list, 2, character: character) }
    before { sign_in(user) }
    before { get api_v1_character_spell_lists_path(character.id), headers: @auth_headers }

    it 'returns a list of spell lists for the character' do
      data = JSON.parse(response.body)
      expect(data['spell_lists'].length).to eq 2
    end
  end
end