require 'rails_helper'
require_relative 'shared_examples/archetype_examples'

RSpec.describe Archetypes::Barbarian do
  it_behaves_like 'an archetype', :barbarian, 'd12', nil

  describe 'specific features' do
    let(:archetype) { described_class.new }

    it 'is not a caster' do
      expect(archetype.caster?).to be false
    end

    it 'has no spell slots' do
      expect(archetype.spell_slots_at_level(20)).to eq([])
    end

    it 'has Rage feature at level 1' do
      expect(archetype.has_feature_at_level?(1, 'Rage')).to be true
    end

    it 'has Unarmored Defense feature at level 1' do
      expect(archetype.has_feature_at_level?(1, 'Unarmored Defense')).to be true
    end
  end
end

