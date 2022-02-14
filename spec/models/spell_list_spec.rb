require 'rails_helper'

RSpec.describe SpellList, type: :model do
  context 'validations' do
    it { should validate_presence_of :name }
  end

  context 'relationships' do
    it { should belong_to :character }
    it { should have_many(:spells).through(:spell_list_items)  }
  end
end