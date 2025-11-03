require 'rails_helper'
require_relative 'shared_examples/archetype_examples'

RSpec.describe Archetypes::Bard do
  it_behaves_like 'an archetype', :bard, 'd8', 'charisma'

  describe 'specific features' do
    let(:archetype) { described_class.new }

    it 'has spellcasting ability of Charisma' do
      expect(archetype.spellcasting_ability).to eq(:charisma)
    end

    it 'has Bardic Inspiration at level 1' do
      expect(archetype.has_feature_at_level?(1, 'Bardic Inspiration')).to be true
    end

    it 'has spell slots at level 1' do
      expect(archetype.spell_slots_at_level(1)).to eq([2])
    end

    it 'has spells known progression' do
      expect(archetype.spells_known_at_level(1)).to be_present
    end

    it 'allows any three skills' do
      skills = archetype.skill_proficiencies.first
      expect(skills.downcase).to include('any')
    end
  end
end

