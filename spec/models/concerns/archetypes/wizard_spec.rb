require "rails_helper"
require_relative "shared_examples/archetype_examples"

RSpec.describe Archetypes::Wizard do
  it_behaves_like "an archetype", :wizard, "d6", "intelligence"

  describe "specific features" do
    let(:archetype) { described_class.new }

    it "has spellcasting ability of Intelligence" do
      expect(archetype.spellcasting_ability).to eq(:intelligence)
    end

    it "has Spellcasting at level 1" do
      expect(archetype.feature_at_level?(1, "Spellcasting")).to be true
    end

    it "has Arcane Recovery at level 1" do
      expect(archetype.feature_at_level?(1, "Arcane Recovery")).to be true
    end

    it "has spells in spellbook formula" do
      formula = archetype.spells_in_spellbook_formula
      expect(formula).to be_present
      expect(formula).to include("Wizard")
    end

    it "has spells prepared formula" do
      formula = archetype.spells_prepared_formula
      expect(formula).to be_present
      expect(formula).to include("Intelligence modifier")
    end

    it "has correct cantrips at level 1" do
      expect(archetype.cantrips_known_at_level(1)).to eq(3)
    end

    it "has correct spell slots progression" do
      expect(archetype.spell_slots_at_level(1)).to eq([2])
      expect(archetype.spell_slots_at_level(5)).to eq([4, 3, 2])
      expect(archetype.spell_slots_at_level(9)).to eq([4, 3, 3, 3, 1])
      expect(archetype.spell_slots_at_level(20)).to eq([4, 3, 3, 3, 3, 2, 2, 1, 1])
    end
  end
end
