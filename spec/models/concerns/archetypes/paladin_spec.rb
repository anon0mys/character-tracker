require "rails_helper"
require_relative "shared_examples/archetype_examples"

RSpec.describe Archetypes::Paladin do
  it_behaves_like "an archetype", :paladin, "d10", "charisma"

  describe "specific features" do
    let(:archetype) { described_class.new }

    it "has spellcasting ability of Charisma" do
      expect(archetype.spellcasting_ability).to eq(:charisma)
    end

    it "uses half-caster spell slot progression" do
      expect(archetype.spell_slots_at_level(1)).to eq([])
      expect(archetype.spell_slots_at_level(2)).to eq([2])
      expect(archetype.spell_slots_at_level(5)).to eq([4, 2])
    end

    it "has Divine Sense at level 1" do
      expect(archetype.feature_at_level?(1, "Divine Sense")).to be true
    end

    it "has Lay on Hands at level 1" do
      expect(archetype.feature_at_level?(1, "Lay on Hands")).to be true
    end

    it "has Extra Attack at level 5" do
      expect(archetype.feature_at_level?(5, "Extra Attack")).to be true
    end
  end
end
