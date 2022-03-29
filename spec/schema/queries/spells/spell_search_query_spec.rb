require 'rails_helper'

describe 'Schema#spells' do
  before { create_list(:spell, 50) }

  it 'should return a list of spells' do
    create(:spell, name: 'Thunderwave')
    create(:spell, name: 'Thunderclap')
    create(:spell, name: 'Lightning and thunder')

    user_query = "
    query SpellSearch($search: SpellSearchInput!) {
      spellSearch(search: $search) {
        name
        description
        archetypes
        level
        school
        castingTime
        range
        duration
        components
      }
    }
    "
    post graphql_path, params: {
      query: user_query,
      variables: {
        search: {
          name: 'thunder'
        }
      }
    }
    result = JSON.parse(response.body)
    spells = result['data']['spellSearch']

    expect(spells.length).to eq 3
  end

  it 'should filter by name' do
    
  end
end

