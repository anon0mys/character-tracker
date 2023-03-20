require 'rails_helper'

describe 'Schema::Query#characters' do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let(:other_characters) { create_list(:character, 2, user: other_user) }
  let(:character_query) {
    <<~GRAPHQL
      query Characters {
        characters {
          name
          archetype
          level
        }
      }
    GRAPHQL
  }

  context 'as an authenticated user' do
    before { create_list(:character, 2, user: user) }
    before { create_list(:character, 2, user: other_user) }
    before { sign_in(user) }
    before { post graphql_path, headers: @auth_headers, params: {query: character_query} }

    it 'should return a list of characters for the current user' do
      result = JSON.parse(response.body)
      characters = result['data']['characters']

      expect(characters.length).to eq 2
    end
  end

  context 'as a visitor' do
    before { post graphql_path, params: {query: character_query} }

    it 'should return an authentication error' do
      result = JSON.parse(response.body)

      expect(result['errors'][0]['message']).to eq 'You need to authenticate to perform this action'
    end
  end
end
