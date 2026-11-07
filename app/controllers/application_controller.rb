class ApplicationController < ActionController::Base
  before_action :parse_auth_token

  private

  def parse_auth_token
    auth_header = request.headers["HTTP_AUTHORIZATION"] || request.headers["Authorization"]
    return unless auth_header

    @current_user = AuthToken.user_for(auth_header.split.last)
  end

  attr_reader :current_user

  def authenticate_user!(_options = {})
    render json: { errors: ["Unauthorized"] }, status: :unauthorized unless signed_in?
  end

  def signed_in?
    @current_user.present?
  end
end
