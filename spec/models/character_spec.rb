require 'rails_helper'

RSpec.describe Character, type: :model do
  context 'validations' do
    it { should validate_presence_of :name }
    it do 
      should define_enum_for(:archetype)
        .with_values(combine_to_hash(Archetypes.names))
        .backed_by_column_of_type(:string)
    end
  end

  context 'relationships' do
    it { should belong_to :user }
    it { should have_many :spell_lists }
    it { should have_many(:items).through(:character_items) }
  end
end
