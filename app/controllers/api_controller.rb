class ApiController < ApplicationController
  include Pagy::Backend

  respond_to :json
  skip_before_action :verify_authenticity_token
  after_action { pagy_headers_merge(@pagy) if @pagy }
  rescue_from ActiveRecord::RecordInvalid, with: :invalid_post

  def invalid_post(exception)
    render json: {errors: exception.message}, status: :unprocessable_entity
  end

  def paginate(data)
    @pagy, @data = pagy(data)
    return pagy_metadata(@pagy).merge({data: @data})
  end
end