class SessionsController < Devise::SessionsController
  clear_respond_to
  respond_to :json
  skip_before_action :verify_authenticity_token

  def create
    user = User.find_by(email: sign_in_params[:email])

    if user&.valid_password?(sign_in_params[:password])
      @current_user = user
      render json: {
        user:,
        token: @current_user.generate_jwt,
      }
    else
      render json: { errors: { "email or password" => "is invalid" } }, status: :unprocessable_entity
    end
  end

  def destroy
    # Need to manage api tokens with a storage mechanism to invalidate them here
    @current_user = nil
    render json: {}, status: :accepted
  end
end
