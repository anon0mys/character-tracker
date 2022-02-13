class RegistrationsController < Devise::RegistrationsController
  clear_respond_to
  respond_to :json
  rescue_from ActiveRecord::RecordInvalid, with: :invalid_signup

  def create
    build_resource(sign_up_params)

    resource.save!

    render json: {
      user: resource,
      token: resource.generate_jwt
    }
  end

  private

  def invalid_signup(exception)
    render json: { errors: exception.message }, status: :unprocessable_entity
  end
end