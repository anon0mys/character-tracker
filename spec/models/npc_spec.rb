require 'rails_helper'

RSpec.describe Npc, type: :model do
  context 'validations' do
    it { should validate_presence_of :name }
    it { should validate_presence_of :race }
  end

  context 'enums' do
    it do
      should define_enum_for(:archetype)
        .with_values(combine_to_hash(Archetypes.names))
        .backed_by_column_of_type(:string)
    end
  end

  context 'relationships' do
    it { should have_many(:factions).through(:faction_npcs) }
    it { should belong_to :location }
  end
end