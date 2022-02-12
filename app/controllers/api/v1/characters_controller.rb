class Api::V1::CharactersController < ApiController
  before_action :authenticate_user!

  def index
    @characters = current_user.characters.all
    render json: {data: @characters}
  end
end