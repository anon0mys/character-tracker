require "rails_helper"
require_relative "shared_examples/archetype_examples"

RSpec.describe Archetypes::Sorcerer do
  it_behaves_like "an archetype", :sorcerer, "d6", "charisma"

  describe "specific features" do
    let(:archetype) { described_class.new }

    it "has spellcasting ability of Charisma" do
      expect(archetype.spellcasting_ability).to eq(:charisma)
    end

    it "has Spellcasting at level 1" do
      expect(archetype.feature_at_level?(1, "Spellcasting")).to be true
    end

    it "has Sorcerous Origin at level 1" do
      expect(archetype.feature_at_level?(1, "Sorcerous Origin")).to be true
    end

    it "has spells known progression" do
      expect(archetype.spells_known_at_level(1)).to eq(2)
      expect(archetype.spells_known_at_level(5)).to be_present
    end

    it "does not have spells prepared formula" do
      expect(archetype.spells_prepared_formula).to be_nil
    end

    it "has correct cantrips at level 1" do
      expect(archetype.cantrips_known_at_level(1)).to eq(4)
    end
  end
end
