require "rails_helper"
require_relative "shared_examples/archetype_examples"

RSpec.describe Archetypes::Warlock do
  it_behaves_like "an archetype", :warlock, "d8", "charisma"

  describe "specific features" do
    let(:archetype) { described_class.new }

    it "has spellcasting ability of Charisma" do
      expect(archetype.spellcasting_ability).to eq(:charisma)
    end

    it "has Pact Magic at level 1" do
      expect(archetype.feature_at_level?(1, "Pact Magic")).to be true
    end

    it "has Otherworldly Patron at level 1" do
      expect(archetype.feature_at_level?(1, "Otherworldly Patron")).to be true
    end

    it "has custom spell slot progression" do
      slots = archetype.spell_slots_at_level(1)
      expect(slots).to be_present
    end

    it "has spells known progression" do
      expect(archetype.spells_known_at_level(1)).to be_present
    end

    it "has correct cantrips at level 1" do
      expect(archetype.cantrips_known_at_level(1)).to eq(2)
    end
  end
end
