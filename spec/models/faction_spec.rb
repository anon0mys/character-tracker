require 'rails_helper'

RSpec.describe Faction, type: :model do
  context 'validations' do
    it { should validate_presence_of :name }
  end

  context 'relationships' do
    it { should have_many(:locations).through(:faction_locations) }
    it { should have_many(:npcs).through(:faction_npcs) }
  end
end