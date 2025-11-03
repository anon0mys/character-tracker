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
    let(:character) { create(:character, archetype: 'wizard', intelligence: 16, level: 3) }
    let(:spell_list) { create(:spell_list, character: character) }
    let(:valid_spell) { create(:spell, archetypes: [character.archetype.name.to_s], level: '1') }
    let(:invalid_spell) { create(:spell, archetypes: ['artificer'], level: '1') }

    it 'should add a spell that includes the character archetype' do
      spell_list.add_spell(valid_spell)
      expect(spell_list.spells.first).to eq(valid_spell)
    end

    it 'should not add the spell if it is already in the list' do
      spell_list.add_spell(valid_spell)
      spell_list.add_spell(valid_spell)
      expect(spell_list.spells.count).to eq 1
    end

    it 'should raise an error if the spell is not available to an archetype' do
      expect { spell_list.add_spell(invalid_spell) }.to raise_error(ActiveRecord::RecordInvalid)
    end

    context 'spell list prepared limit' do
      let(:cleric) { create(:character, archetype: 'cleric', wisdom: 18, level: 5, proficiencies: ['wisdom', 'charisma']) }
      let(:cleric_spell_list) { create(:spell_list, character: cleric) }

      it 'should allow adding spells up to the prepared limit' do
        max_prepared = cleric.max_spells_prepared
        expect(max_prepared).to eq(9) # 4 (Wisdom modifier) + 5 (level)

        max_prepared.times do |i|
          spell = create(:spell, archetypes: ['cleric'], level: '1')
          expect { cleric_spell_list.add_spell(spell) }.not_to raise_error
        end

        expect(cleric_spell_list.spells.count { |s| s.level != 'cantrip' }).to eq(max_prepared)
      end

      it 'should prevent adding spells beyond the prepared limit' do
        max_prepared = cleric.max_spells_prepared

        max_prepared.times do
          spell = create(:spell, archetypes: ['cleric'], level: '1')
          cleric_spell_list.add_spell(spell)
        end

        extra_spell = create(:spell, archetypes: ['cleric'], level: '1')
        expect { cleric_spell_list.add_spell(extra_spell) }.to raise_error(ActiveRecord::RecordInvalid)
      end

      it 'should not count cantrips against the prepared limit' do
        max_prepared = cleric.max_spells_prepared

        # Add max prepared spells
        max_prepared.times do
          spell = create(:spell, archetypes: ['cleric'], level: '1')
          cleric_spell_list.add_spell(spell)
        end

        # Add cantrips (should not count against limit)
        cantrip = create(:spell, archetypes: ['cleric'], level: 'cantrip')
        expect { cleric_spell_list.add_spell(cantrip) }.not_to raise_error

        expect(cleric_spell_list.spells.count { |s| s.level == 'cantrip' }).to eq(1)
        expect(cleric_spell_list.spells.count { |s| s.level != 'cantrip' }).to eq(max_prepared)
      end
    end
  end
end
