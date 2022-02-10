require 'rails_helper'

describe 'GET /api/v1/characters' do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let(:other_characters) { create_list(:character, 2, user: other_user) }

  context 'as an authenticated user' do
    before { create_list(:character, 2, user: user) }
    before { create_list(:character, 2, user: other_user) }
    before { sign_in(user) }
    before { get api_v1_characters_path, headers: @auth_headers }

    it 'returns a list of characters' do
      data = JSON.parse(response.body)
      response_ids = data['characters'].map {|character| character['id']}
      expect(response_ids).to eq(user.characters.pluck(:id))
    end

    it 'does not return characters belonging to other users' do
      data = JSON.parse(response.body)
      response_ids = data['characters'].map {|character| character['id']}
      expect(response_ids).not_to include(other_user.characters.pluck(:id))
    end
  end
    
  context 'as a visitor' do
    before { get api_v1_characters_path, headers: @auth_headers }

    it 'should a 401 status' do
      expect(response.status).to be 401
    end
  end
end