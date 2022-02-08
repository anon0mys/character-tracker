require 'rails_helper'

RSpec.describe AdminUser, type: :model do
  context 'validations' do
    it { should validate_presence_of :email }
  end
end
