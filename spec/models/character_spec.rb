require 'rails_helper'

RSpec.describe Character, type: :model do
  context 'validations' do
    it { should validate_presence_of :name }
    it { should define_enum_for :archetype }
  end

  context 'relationships' do
    it { should belong_to :user }
  end
end
