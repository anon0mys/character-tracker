class ApiController < ApplicationController
  include Pagy::Backend

  respond_to :json
  skip_before_action :verify_authenticity_token
  after_action { pagy_headers_merge(@pagy) if @pagy }
  
  # Handle common exceptions and return JSON responses
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :record_invalid
  rescue_from ActionController::ParameterMissing, with: :parameter_missing
  rescue_from ActiveRecord::RecordNotUnique, with: :record_not_unique
  rescue_from StandardError, with: :handle_standard_error

  def paginate(data)
    @pagy, @data = pagy(data)
    return pagy_metadata(@pagy).merge({data: @data})
  end

  private

  def record_not_found(exception)
    Rails.logger.error "RecordNotFound: #{exception.message}"
    render json: {
      errors: [exception.message || "Record not found"],
      error_type: "RecordNotFound"
    }, status: :not_found
  end

  def record_invalid(exception)
    Rails.logger.error "RecordInvalid: #{exception.message}"
    errors = if exception.record
      exception.record.errors.full_messages
    else
      [exception.message]
    end
    
    render json: {
      errors: errors,
      error_type: "RecordInvalid"
    }, status: :unprocessable_entity
  end

  def parameter_missing(exception)
    Rails.logger.error "ParameterMissing: #{exception.message}"
    render json: {
      errors: ["Missing required parameter: #{exception.param}"],
      error_type: "ParameterMissing"
    }, status: :bad_request
  end

  def record_not_unique(exception)
    Rails.logger.error "RecordNotUnique: #{exception.message}"
    render json: {
      errors: ["A record with these attributes already exists"],
      error_type: "RecordNotUnique"
    }, status: :unprocessable_entity
  end

  def handle_standard_error(exception)
    Rails.logger.error "StandardError in API: #{exception.class} - #{exception.message}"
    Rails.logger.error exception.backtrace.join("\n") if exception.backtrace
    
    # In development, return more detailed error information
    error_message = if Rails.env.development?
      {
        errors: [exception.message],
        error_type: exception.class.name,
        backtrace: exception.backtrace&.first(5)
      }
    else
      {
        errors: ["An unexpected error occurred. Please try again later."],
        error_type: "InternalServerError"
      }
    end
    
    render json: error_message, status: :internal_server_error
  end
end
