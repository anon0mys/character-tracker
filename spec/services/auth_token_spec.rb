require "rails_helper"

RSpec.describe AuthToken do
  let(:user) { create(:user) }

  it "finds the user a generated token belongs to" do
    expect(described_class.user_for(user.generate_jwt)).to eq(user)
  end

  it "rejects tokens signed with any other secret, or already expired" do
    forged = JWT.encode({ id: user.id, exp: 1.day.from_now.to_i }, "the-old-leaked-secret")
    expired = JWT.encode({ id: user.id, exp: 1.minute.ago.to_i }, described_class.secret)

    expect(described_class.user_for(forged)).to be_nil
    expect(described_class.user_for(expired)).to be_nil
    expect(described_class.user_for("")).to be_nil
  end

  it "signs with the app's secret_key_base (SECRET_KEY_BASE in production)" do
    expect(described_class.secret).to eq(Rails.application.secret_key_base)
    expect(described_class.secret).to be_present
  end
end
