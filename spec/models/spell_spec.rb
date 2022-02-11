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
        combinations = (1..Archetypes.names.length).flat_map do |size|
          Archetypes.names.combination(size).to_a
        end
        combinations.each do |combination|
          it { should allow_value(combination).for(:archetypes) }
        end

        it { should_not allow_value([:random]).for(:archetypes) }
      end

      context 'components' do
        combinations = (1..Spell::COMPONENTS.length).flat_map do |size|
          Spell::COMPONENTS.combination(size).to_a
        end
        combinations.each do |combination|
          it { should allow_value(combination).for(:components) }
        end

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
end