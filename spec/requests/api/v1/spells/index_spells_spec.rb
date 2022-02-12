require 'rails_helper'

describe 'GET /api/v1/spells' do
  let(:user) { create(:user) }
  before { create_list(:spell, 50) }

  context 'as an authenticated user' do
    before { sign_in(user) }

    context 'with no filter' do
      it 'should return a paginated list of spells' do
        get api_v1_spells_path, headers: @auth_headers
        data = JSON.parse(response.body)
        expect(data['data'].count).to eq 20
        expect(data['data'][0]['id']).to be 1
        expect(data['data'][-1]['id']).to be 20
      end

      it 'should be able to return the next page' do
        get api_v1_spells_path + '?page=2', headers: @auth_headers
        data = JSON.parse(response.body)
        expect(data['data'].count).to eq 20
        expect(data['data'][0]['id']).to be 21
        expect(data['data'][-1]['id']).to be 40
      end
    end

    context 'with filters' do
      it 'should filter by archetype' do
        get api_v1_spells_path + '?archetype=artificer', headers: @auth_headers
        data = JSON.parse(response.body)
        expect(data['data'].count).to eq Spell.where('archetypes && ?', '{artificer}').count
      end
    end
  end
end