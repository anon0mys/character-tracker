require 'rails_helper'

describe 'GET /api/v1/characters/:id' do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }

  context 'as an authenticated user' do
    let(:character) { create(:character, user: user, name: 'Test Char') }
    before { sign_in(user) }
    before { get api_v1_character_path(character.id), headers: @auth_headers }

    it 'returns a character for the user' do
      result = JSON.parse(response.body)
      expect(result['data']['name']).to eq('Test Char')
    end
  end
end