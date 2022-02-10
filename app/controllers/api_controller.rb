class ApiController < ApplicationController
  respond_to :json
  before_action :authenticate_user

  private

  def authenticate_user
    token = request.headers['Authentication']&.split(' ')&.last
    begin
      jwt_payload = JWT.decode(token, Rails.application.secrets.secret_key_base).first
      @current_user_id = jwt_payload['id']
    rescue JWT::ExpiredSignature, JWT::VerificationError, JWT::DecodeError
      head :unauthorized
    end
  end

  def authenticate_user!(options = {})
    head :unauthorized unless signed_in?
  end

  def current_user
    @current_user ||= super || User.find(@current_user_id)
  end

  def signed_in?
    @current_user_id.present?
  end
end