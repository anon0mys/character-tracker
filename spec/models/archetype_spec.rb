require "rails_helper"

RSpec.describe Archetype do
  # archetypes are seeded before the suite (see spec/support/seed_archetypes.rb)
  let(:wizard) { described_class.find_by(name: "wizard") }
  let(:paladin) { described_class.find_by(name: "paladin") }
  let(:fighter) { described_class.find_by(name: "fighter") }

  context "validations" do
    it "requires a name" do
      expect(described_class.new(name: nil)).not_to be_valid
    end

    it "requires a unique name" do
      dup = described_class.new(name: "wizard")
      expect(dup).not_to be_valid
      expect(dup.errors[:name]).to be_present
    end
  end

  context "relationships" do
    it { is_expected.to have_many(:subclasses).dependent(:destroy) }
    it { is_expected.to have_many(:characters).dependent(:nullify) }

    it "has its scraped subclasses" do
      expect(wizard.subclasses.count).to be > 0
      expect(wizard.subclasses.pluck(:name)).to include("Necromancy")
    end
  end

  context "ported class data" do
    it "exposes hit die and casting ability" do
      expect(wizard.hit_die).to eq "d6"
      expect(wizard.spellcasting_ability).to eq "intelligence"
      expect(wizard.caster?).to be true
    end

    it "is not a caster for martial classes" do
      expect(fighter.caster?).to be false
      expect(fighter.spell_slots_at_level(1)).to eq []
    end

    it "computes full-caster spell slots" do
      expect(wizard.spell_slots_at_level(5)).to eq [4, 3, 2]
    end

    it "computes half-caster spell slots" do
      expect(paladin.spell_slots_at_level(5)).to eq [4, 2]
    end

    it "exposes skill proficiencies and features" do
      expect(wizard.skill_proficiencies).to be_an(Array)
      expect(wizard.class_features).to be_an(Array)
      expect(wizard.features_at_level(1)).to be_an(Array)
    end
  end
end
