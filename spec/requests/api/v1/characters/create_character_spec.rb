require 'rails_helper'

describe 'POST /api/v1/characters' do
  let(:user) { create(:user) }
  let(:game) { create(:game) }
  let(:other_user) { create(:user) }
  let(:valid_attrs) {{
    character: {
      name: 'Test Char',
      archetype: :artificer,
      game_id: game.id,
    }
  }}

  context 'as an authenticated user' do
    before { sign_in(user) }
    before { post api_v1_characters_path, headers: @auth_headers, params: valid_attrs }

    it 'creates a new character for the user' do
      result = JSON.parse(response.body)
      expect(result['data']['name']).to eq('Test Char')
      expect(result['data']['archetype']).to eq('artificer')
      expect(result['data']['user_id']).to eq(user.id)
    end
  end
end