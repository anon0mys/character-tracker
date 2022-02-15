require 'rails_helper'

RSpec.describe SpellList, type: :model do
  context 'validations' do
    it { should validate_presence_of :name }
  end

  context 'relationships' do
    it { should belong_to :character }
    it { should have_many(:spells).through(:spell_list_items)  }
  end

  context '#add_spell' do
    let(:character) { create(:character, archetype: 'wizard') }
    let(:spell_list) { create(:spell_list, character: character) }
    let(:valid_spell) { create(:spell, archetypes: [character.archetype]) }
    let(:invalid_spell) { create(:spell, archetypes: ['artificer']) }

    it 'should add a spell that includes the character archetype' do
      spell_list.add_spell(valid_spell)
      expect(spell_list.spells.first).to eq(valid_spell)
    end

    it 'should raise an error if the spell is not available to an archetype' do
      expect { spell_list.add_spell(invalid_spell) }.to raise_error(ActiveRecord::RecordInvalid)
    end
  end
end