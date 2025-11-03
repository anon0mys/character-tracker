require "rails_helper"

describe "POST /api/v1/login" do
  let(:user) { create(:user, password: "testpass123") }
  let(:valid_credentials) do
    {
      user: {
        email: user.email,
        password: "testpass123",
      },
    }
  end
  let(:invalid_credentials) do
    {
      user: {
        email: "bad@email.com",
        password: "badpass",
      },
    }
  end

  context "with valid credentials" do
    before { post user_session_path, params: valid_credentials }

    it "returns a JWT token" do
      data = response.parsed_body
      jwt_payload = JWT.decode(data["token"], Rails.application.credentials.secret_key_base).first
      expect(jwt_payload["id"]).to eq user.id
    end
  end

  context "with invalid credentials" do
    before { post user_session_path, params: invalid_credentials }

    it "returns a 422 status" do
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end
