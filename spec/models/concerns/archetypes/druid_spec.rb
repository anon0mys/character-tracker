require 'rails_helper'
require_relative 'shared_examples/archetype_examples'

RSpec.describe Archetypes::Druid do
  it_behaves_like 'an archetype', :druid, 'd8', 'wisdom'

  describe 'specific features' do
    let(:archetype) { described_class.new }

    it 'has spellcasting ability of Wisdom' do
      expect(archetype.spellcasting_ability).to eq(:wisdom)
    end

    it 'has spells prepared formula' do
      formula = archetype.spells_prepared_formula
      expect(formula).to be_present
      expect(formula).to include('Wisdom modifier')
    end

    it 'has correct cantrips at level 1' do
      expect(archetype.cantrips_known_at_level(1)).to eq(2)
    end
  end
end

