class ApiController < ApplicationController
  include Pagy::Backend

  respond_to :json
  skip_before_action :verify_authenticity_token
  before_action :authenticate_user
  after_action { pagy_headers_merge(@pagy) if @pagy }
  rescue_from ActiveRecord::RecordInvalid, with: :invalid_post

  private

  def authenticate_user
    token = request.headers['HTTP_AUTHORIZATION']&.split(' ')&.last
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

  def invalid_post(exception)
    render json: {errors: exception.message}, status: :unprocessable_entity
  end
end