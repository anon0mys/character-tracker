require "rails_helper"

describe "POST /api/v1/users" do
  let(:valid_attrs) do
    {
      user: {
        email: "test@email.com",
        password: "testpass123",
        password_confirmation: "testpass123",
      },
    }
  end
  let(:invalid_attrs) do
    {
      user: {
        email: "test@email.com",
        password: "testpass123",
        password_confirmation: "nomatch",
      },
    }
  end

  context "with valid credentials" do
    before { post user_registration_path, params: valid_attrs }

    it "returns a JWT token" do
      data = response.parsed_body
      jwt_payload = JWT.decode(data["token"], Rails.application.credentials.secret_key_base).first
      expect(jwt_payload.keys).to eq %w[id exp]
    end

    it "returns a User" do
      expect(response.parsed_body["data"]).to be_present
    end
  end

  context "with invalid credentials" do
    before { post user_registration_path, params: invalid_attrs }

    it "returns a 422 status" do
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end
