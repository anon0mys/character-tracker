require 'rails_helper'

describe 'Schema::Mutation#create_character' do
  let(:game) { create(:game) }
  let(:user) { create(:user) }
  before { create(:user_game, user: user, game: game) }
  let(:character_attrs) {{
    character: {
      name: 'Test Char',
      archetype: 'ARTIFICER',
      gameId: game.id
    }
  }}
  let(:character_query) {
      <<~GRAPHQL
      mutation CreateCharacter($input: CreateCharacterMutationInput!) {
        createCharacter(input: $input) {
          character {
            name
            archetype
            level
          }
        }
      }
      GRAPHQL
  }

  context 'as an authenticated user' do
    let(:someone_elses_game) { create(:game) }
    before { sign_in(user) }

    it 'should create a character for the current user and selected game' do
      post graphql_path, headers: @auth_headers, params: {query: character_query, variables: {input: character_attrs}}
      result = JSON.parse(response.body)
      character = result['data']['createCharacter']['character']

      expect(character['name']).to eq 'Test Char'
      expect(character['archetype']).to eq 'artificer'
      expect(character['level']).to eq '1'
    end

    it 'should fail to create a character for the current user if they have not joined the selected game' do
      character_attrs[:character][:gameId] = someone_elses_game.id
      post graphql_path, headers: @auth_headers, params: {query: character_query, variables: {input: character_attrs}}
      result = JSON.parse(response.body)
      expect(result['data']['createCharacter']).to be nil
      expect(result['errors'][0]['message']).to eq 'not allowed to join_game? this Character'
    end

    it 'should fail to create a character for the current user with invalid attributes' do
      character_attrs[:character][:archetype] = 'NOT AN ACTUAL CLASS'
      post graphql_path, headers: @auth_headers, params: {query: character_query, variables: {input: character_attrs}}
      result = JSON.parse(response.body)
      expect(result['errors'][0]['message']).to include 'Expected "NOT AN ACTUAL CLASS" to be one of:'
    end
  end

  context 'as a visitor' do
    before { post graphql_path, params: {query: character_query, variables: {input: character_attrs}} }

    it 'should return an authentication error' do
      result = JSON.parse(response.body)

      expect(result['errors'][0]['message']).to eq 'You need to authenticate to perform this action'
    end
  end
end
