class ApplicationController < ActionController::Base
  before_action :parse_auth_token

  private

  def parse_auth_token
    auth_header = request.headers['HTTP_AUTHORIZATION'] || request.headers['Authorization']
    return unless auth_header
    
    token = auth_header.split(' ').last
    return unless token.present?
    
    begin
      jwt_payload = JWT.decode(token, Rails.application.credentials.secret_key_base).first
      @current_user = User.find_by(id: jwt_payload['id'])
    rescue JWT::ExpiredSignature => e
      Rails.logger.error "JWT ExpiredSignature: #{e.message}"
      @current_user = nil
    rescue JWT::VerificationError => e
      Rails.logger.error "JWT VerificationError: #{e.message}"
      @current_user = nil
    rescue JWT::DecodeError => e
      Rails.logger.error "JWT DecodeError: #{e.message} - Token: #{token[0..20]}..."
      @current_user = nil
    rescue => e
      Rails.logger.error "Unexpected error parsing auth token: #{e.class} - #{e.message}"
      @current_user = nil
    end
  end

  def current_user
    @current_user
  end

  def authenticate_user!(options = {})
    head :unauthorized unless signed_in?
  end

  def signed_in?
    @current_user.present?
  end
end
