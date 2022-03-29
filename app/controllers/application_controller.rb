class ApplicationController < ActionController::Base
  before_action :parse_auth_token

  private

  def parse_auth_token
    token = request.headers['HTTP_AUTHORIZATION']&.split(' ')&.last
    begin
      jwt_payload = JWT.decode(token, Rails.application.secrets.secret_key_base).first
      @current_user = User.find_by(id: jwt_payload['id'])
    rescue JWT::ExpiredSignature, JWT::VerificationError, JWT::DecodeError
      @current_user = nil
    end
  end

  def authenticate_user!(options = {})
    head :unauthorized unless signed_in?
  end

  def signed_in?
    @current_user.present?
  end
end
