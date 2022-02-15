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
        expect(data['spells'].count).to eq 20
        expect(data['spells'][0]['id']).to be 1
        expect(data['spells'][-1]['id']).to be 20
      end

      it 'should be able to return the next page' do
        get api_v1_spells_path + '?page=2', headers: @auth_headers
        data = JSON.parse(response.body)
        expect(data['spells'].count).to eq 20
        expect(data['spells'][0]['id']).to be 21
        expect(data['spells'][-1]['id']).to be 40
      end
    end

    context 'with filters' do
      it 'should filter by archetype' do
        get api_v1_spells_path + '?archetype=artificer', headers: @auth_headers
        data = JSON.parse(response.body)
        expect(data['spells'].count).to eq Spell.where('archetypes && ?', '{artificer}').count
      end

      it 'should filter by level' do
        get api_v1_spells_path + '?level=cantrip', headers: @auth_headers
        data = JSON.parse(response.body)
        expect(data['spells'].count).to eq Spell.where(level: 'cantrip').count
      end

      it 'should filter by school' do
        get api_v1_spells_path + '?school=evocation', headers: @auth_headers
        data = JSON.parse(response.body)
        expect(data['spells'].count).to eq Spell.where(school: 'evocation').count
      end

      it 'should be able to combine filters' do
        create(:spell, school: 'evocation', level: '9', archetypes: ['wizard'])
        get(
          api_v1_spells_path + '?school=evocation&archetype=wizard&level=9',
          headers: @auth_headers
        )
        data = JSON.parse(response.body)
        expect(data['spells'].count).to eq Spell
          .where(level: '9', school: 'evocation')
          .where('archetypes && ?', '{wizard}')
          .count
      end
    end
  end
end