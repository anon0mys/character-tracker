require 'rails_helper'
require_relative 'shared_examples/archetype_examples'

RSpec.describe Archetypes::Monk do
  it_behaves_like 'an archetype', :monk, 'd8', nil

  describe 'specific features' do
    let(:archetype) { described_class.new }

    it 'is not a caster' do
      expect(archetype.caster?).to be false
    end

    it 'has Unarmored Defense at level 1' do
      expect(archetype.has_feature_at_level?(1, 'Unarmored Defense')).to be true
    end

    it 'has Martial Arts at level 1' do
      expect(archetype.has_feature_at_level?(1, 'Martial Arts')).to be true
    end
  end
end

