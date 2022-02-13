require 'rails_helper'

describe 'POST /api/v1/users' do
  let(:valid_attrs) {{
    user: {
      email: 'test@email.com',
      password: 'testpass123',
      password_confirmation: 'testpass123'
    }
  }}
  let(:invalid_attrs) {{
    user: {
      email: 'test@email.com',
      password: 'testpass123',
      password_confirmation: 'nomatch'
    }
  }}

  context 'with valid credentials' do
    before { post user_registration_path, params: valid_attrs }

    it 'should return a JWT token' do
      data = JSON.parse(response.body)
      jwt_payload = JWT.decode(data['token'], Rails.application.secrets.secret_key_base).first
      expect(jwt_payload['id']).to eq 1
    end

    it 'should return a User' do
      data = JSON.parse(response.body)
    end
  end

  context 'with invalid credentials' do
    before { post user_registration_path, params: invalid_attrs }

    it 'should return a 422 status' do
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end