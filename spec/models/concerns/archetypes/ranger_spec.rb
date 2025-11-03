require 'rails_helper'
require_relative 'shared_examples/archetype_examples'

RSpec.describe Archetypes::Ranger do
  it_behaves_like 'an archetype', :ranger, 'd10', 'wisdom'

  describe 'specific features' do
    let(:archetype) { described_class.new }

    it 'has spellcasting ability of Wisdom' do
      expect(archetype.spellcasting_ability).to eq(:wisdom)
    end

    it 'uses half-caster spell slot progression' do
      expect(archetype.spell_slots_at_level(1)).to eq([])
      expect(archetype.spell_slots_at_level(2)).to eq([2])
      expect(archetype.spell_slots_at_level(5)).to eq([4, 2])
    end

    it 'has Favored Enemy at level 1' do
      expect(archetype.has_feature_at_level?(1, 'Favored Enemy')).to be true
    end

    it 'has Natural Explorer at level 1' do
      expect(archetype.has_feature_at_level?(1, 'Natural Explorer')).to be true
    end

    it 'has Extra Attack at level 5' do
      expect(archetype.has_feature_at_level?(5, 'Extra Attack')).to be true
    end
  end
end

