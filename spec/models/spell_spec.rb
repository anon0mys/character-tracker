require 'rails_helper'

RSpec.describe Spell, type: :model do
  context 'validations' do
    context 'attributes' do
      it { should validate_presence_of :name }
      it { should validate_presence_of :casting_time }
      it { should validate_presence_of :range }
      it { should validate_presence_of :duration }
    end

    context 'array enums' do
      context 'archetypes' do
        it { should allow_value(Archetypes.names).for(:archetypes) }
        it { should_not allow_value([:random]).for(:archetypes) }
      end

      context 'components' do
        it { should allow_value(Spell::COMPONENTS).for(:components) }
        it { should_not allow_value(['RANDOM']).for(:components) }
      end
    end

    context 'enums' do
      it do
        should define_enum_for(:level)
          .with_values(combine_to_hash(Spell::LEVELS))
          .backed_by_column_of_type(:string)
      end

      it do
        should define_enum_for(:school)
          .with_values(combine_to_hash(Spell::SCHOOLS))
          .backed_by_column_of_type(:string)
      end
    end
  end

  context 'scopes' do
    it 'should filter by archetype' do
      create(:spell, archetypes: %i[artificer wizard])
      create(:spell, archetypes: %i[artificer druid sorcerer])
      create(:spell, archetypes: %i[cleric druid])

      expect(Spell.filter_by_archetype('artificer').count).to eq 2
      expect(Spell.filter_by_archetype('druid').count).to eq 2
      expect(Spell.filter_by_archetype('cleric').count).to eq 1
    end
  end
end