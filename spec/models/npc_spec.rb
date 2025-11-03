require "rails_helper"

RSpec.describe Npc do
  subject(:npc) { build(:npc) }

  context "validations" do
    it { is_expected.to validate_presence_of :name }
    it { is_expected.to validate_presence_of :race }
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
    it { is_expected.to belong_to :location }
  end
end
