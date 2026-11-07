require "rails_helper"

RSpec.describe Npc do
  subject(:npc) { build(:npc) }

  context "validations" do
    it { is_expected.to validate_presence_of :name }

    it "needs no class, race or location" do
      expect(build(:npc, archetype: nil, race: nil, location: nil)).to be_valid
    end
  end

  context "enums" do
    it do
      expect(npc).to define_enum_for(:archetype)
        .with_values(combine_to_hash(Archetypes.names))
        .backed_by_column_of_type(:string)
    end
  end

  context "relationships" do
    it { is_expected.to have_many(:factions).through(:faction_npcs) }
    it { is_expected.to belong_to(:location).optional }
    it { is_expected.to belong_to(:game).optional }
    it { is_expected.to have_many(:holdings).dependent(:destroy) }
  end
end
