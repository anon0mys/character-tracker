require 'rails_helper'

describe 'GET /api/v1/characters/:character_id/spell_lists/:spell_list_id' do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }

  context 'as an authenticated user' do
    let(:character) { create(:character, user: user, name: 'Test Char') }
    let(:spell_list) { create(:spell_list, character: character) }
    let(:spell) { create(:spell, archetypes: [character.archetype]) }
    before { spell_list.add_spell(spell) }
    before { sign_in(user) }
    before { get api_v1_character_spell_list_path(character.id, spell_list.id), headers: @auth_headers }

    it 'returns a spell list for the character' do
      data = JSON.parse(response.body)
      expect(data['spell_list']['spells'].length).to eq 1
    end
  end
end