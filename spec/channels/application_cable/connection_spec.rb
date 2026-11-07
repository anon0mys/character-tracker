require "rails_helper"

RSpec.describe ApplicationCable::Connection do
  let(:user) { create(:user) }

  it "identifies the user from the token param" do
    connect "/cable", params: { token: user.generate_jwt }

    expect(connection.current_user).to eq(user)
  end

  it "rejects a missing or bad token" do
    expect { connect "/cable" }.to have_rejected_connection
    expect { connect "/cable", params: { token: "nope" } }.to have_rejected_connection
  end
end
