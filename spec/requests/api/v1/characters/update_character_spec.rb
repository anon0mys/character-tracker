require 'rails_helper'

describe 'PATCH /api/v1/characters' do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let(:valid_attrs) {{character: {name: 'Test Char'}}}

  context 'as an authenticated user' do
    let(:character) { create(:character, user: user, name: 'Initial Name') }
    before { sign_in(user) }
    before { patch api_v1_character_path(character.id), headers: @auth_headers, params: valid_attrs }

    it 'updates a character for the user' do
      data = JSON.parse(response.body)
      expect(data['character']['name']).to eq('Test Char')
    end
  end
end