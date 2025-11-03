require 'rails_helper'
require_relative 'shared_examples/archetype_examples'

RSpec.describe Archetypes::Artificer do
  it_behaves_like 'an archetype', :artificer, 'd8', 'intelligence'

  describe 'specific features' do
    let(:archetype) { described_class.new }

    it 'has spellcasting ability of Intelligence' do
      expect(archetype.spellcasting_ability).to eq(:intelligence)
    end

    it 'has correct spell slots at level 1' do
      expect(archetype.spell_slots_at_level(1)).to eq([2])
    end

    it 'has correct spell slots at level 5' do
      slots = archetype.spell_slots_at_level(5)
      expect(slots).to be_an(Array)
      expect(slots.length).to be > 0
    end
  end
end

