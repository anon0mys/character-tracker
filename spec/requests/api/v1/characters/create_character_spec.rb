require 'rails_helper'

describe 'POST /api/v1/characters' do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let(:valid_attrs) {{
    character: {
      name: 'Test Char',
      archetype: :artificer
    }
  }}

  context 'as an authenticated user' do
    before { sign_in(user) }
    before { post api_v1_characters_path, headers: @auth_headers, params: valid_attrs }

    it 'returns creates a new character for the user' do
      data = JSON.parse(response.body)
      expect(data['data']['name']).to eq('Test Char')
      expect(data['data']['archetype']).to eq('artificer')
      expect(data['data']['user_id']).to eq(user.id)
    end
  end
end