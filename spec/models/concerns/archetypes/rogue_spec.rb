require 'rails_helper'
require_relative 'shared_examples/archetype_examples'

RSpec.describe Archetypes::Rogue do
  it_behaves_like 'an archetype', :rogue, 'd8', nil

  describe 'specific features' do
    let(:archetype) { described_class.new }

    it 'is not a caster' do
      expect(archetype.caster?).to be false
    end

    it 'has Expertise at level 1' do
      expect(archetype.has_feature_at_level?(1, 'Expertise')).to be true
    end

    it 'has Sneak Attack at level 1' do
      expect(archetype.has_feature_at_level?(1, 'Sneak Attack')).to be true
    end

    it 'has Thieves Cant at level 1' do
      expect(archetype.has_feature_at_level?(1, "Thieves' Cant")).to be true
    end

    it 'has many skill choices' do
      skills = archetype.skill_proficiencies.first
      expect(skills).to include('Choose four')
    end
  end
end

