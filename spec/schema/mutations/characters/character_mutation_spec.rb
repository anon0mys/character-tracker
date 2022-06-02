require 'rails_helper'

describe 'Schema::Mutation#create_character' do
  let(:user) { create(:user) }
  let(:valid_attrs) {{
    character: {
      name: 'Test Char',
      archetype: 'ARTIFICER'
    }
  }}
  let(:character_query) {
      "
      mutation CreateCharacter($input: CreateCharacterMutationInput!) {
        createCharacter(input: $input) {
          character {
            name
            archetype
            level
          }
        }
      }
      "
  }

  context 'as an authenticated user' do
    before { sign_in(user) }
    before { post graphql_path, headers: @auth_headers, params: {query: character_query, variables: {input: valid_attrs}} }

    it 'should create a character for the current user' do
      result = JSON.parse(response.body)
      character = result['data']['createCharacter']['character']

      expect(character['name']).to eq 'Test Char'
      expect(character['archetype']).to eq 'artificer'
      expect(character['level']).to eq '1'
    end
  end

  context 'as a visitor' do
    before { post graphql_path, params: {query: character_query, variables: {input: valid_attrs}} }

    it 'should return an authentication error' do
      result = JSON.parse(response.body)

      expect(result['errors'][0]['message']).to eq 'You need to authenticate to perform this action'
    end
  end
end
