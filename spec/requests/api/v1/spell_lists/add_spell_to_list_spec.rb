require 'rails_helper'

describe 'POST /api/v1/characters/:character_id/spell_lists/:spell_list_id/add_spell' do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }

  context 'as an authenticated user' do
    before { sign_in(user) }
    let(:character) { create(:character, user: user, archetype: 'wizard') }
    let(:spell_list) { create(:spell_list, character: character) }

    context 'with valid attrs' do
      let(:spell) { create(:spell, archetypes: [character.archetype]) }
      let(:valid_attrs) {{ spell: { id: spell.id } }}

      before { post api_v1_character_spell_list_add_spell_path(character.id, spell_list.id),
                headers: @auth_headers,
                params: valid_attrs 
      }

      it 'adds a spell to the spell list' do
        data = JSON.parse(response.body)
        expect(data['spell_list']['spells'].length).to eq 1
      end
    end

    context 'with a spell that is not available to the character' do
      let(:spell) { create(:spell, archetypes: ['artificer']) }
      let(:invalid_attrs) {{ spell: { id: spell.id } }}

      before { post api_v1_character_spell_list_add_spell_path(character.id, spell_list.id),
                headers: @auth_headers,
                params: invalid_attrs 
      }

      it 'responds with a descriptive error message' do
        data = JSON.parse(response.body)
        expect(data['errors']).to eq 'Validation failed: Code spell is not availble to this character archetype'
      end

      it 'responds with a status 422' do
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end