require "rails_helper"

RSpec.describe AdminUser do
  context "validations" do
    it { is_expected.to validate_presence_of :email }
  end
end
